package se.scoreboard.engine

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import se.scoreboard.data.repo.ContenderRepository
import se.scoreboard.data.repo.ContestRepository
import se.scoreboard.data.repo.ProblemRepository
import se.scoreboard.data.repo.TickRepository
import se.scoreboard.dto.ScoringDto
import se.scoreboard.dto.CurrentPointsDto
import se.scoreboard.engine.data.ContenderData
import se.scoreboard.engine.data.ContestData
import se.scoreboard.engine.data.ProblemData
import se.scoreboard.engine.data.TickData
import se.scoreboard.engine.params.*
import se.scoreboard.service.BroadcastService
import javax.annotation.PostConstruct
import java.util.concurrent.locks.ReentrantLock

@Service
class DefaultScoringEngine : ScoringEngine {
    @Autowired
    private lateinit var contestRepository: ContestRepository
    @Autowired
    private lateinit var problemRepository: ProblemRepository
    @Autowired
    private lateinit var tickRepository: TickRepository
    @Autowired
    private lateinit var contenderRepository: ContenderRepository
    @Autowired
    private lateinit var broadcastService: BroadcastService

    private var lock = ReentrantLock()
    private var queuedScoringBroadcasts: MutableMap<Int, Pair<Int, ScoringDto>> = mutableMapOf()

    private var contests: MutableMap<Int, ContestData> = mutableMapOf()
    private var problems: MutableMap<Int, ProblemData> = mutableMapOf()
    private var ticks: MutableMap<Int, TickData> = mutableMapOf()
    private var contenders: MutableMap<Int, ContenderData> = mutableMapOf()

    companion object {
        private var logger = LoggerFactory.getLogger(DefaultScoringEngine::class.java)
    }

    @PostConstruct
    fun loadData() {
        for (contest in contestRepository.findAll()) {
            registerContest(RegisterContestParam(contest.id!!))
        }

        ProblemData.broadcastService = broadcastService
        queuedScoringBroadcasts.clear()
    }

    @Async
    override fun dispatch(action: ActionType, parameter: ActionParam) {
        await(action, parameter)
    }

    override fun await(action: ActionType, parameter: ActionParam) {
        lock.lock()
        logger.info("Processing action ${action} with parameter ${parameter}")
        try {
            when (action) {
                ActionType.REGISTER_TICK -> {
                    if (parameter is RegisterTickParam) {
                        registerTick(parameter)
                    }
                }
                ActionType.UNREGISTER_TICK -> {
                    if (parameter is UnregisterTickParam) {
                        unregisterTick(parameter)
                    }
                }
                ActionType.REGISTER_PROBLEM -> {
                    if (parameter is RegisterProblemParam) {
                        registerProblem(parameter)
                    }
                }
                ActionType.UNREGISTER_PROBLEM -> {
                    if (parameter is UnregisterProblemParam) {
                        unregisterProblem(parameter)
                    }
                }
                ActionType.REGISTER_CONTEST -> {
                    if (parameter is RegisterContestParam) {
                        registerContest(parameter)
                    }
                }
                ActionType.UNREGISTER_CONTEST -> {
                    if (parameter is UnregisterContestParam) {
                        unregisterContest(parameter)
                    }
                }
                ActionType.REGISTER_CONTENDER -> {
                    if (parameter is RegisterContenderParam) {
                        registerContender(parameter)
                    }
                }
                ActionType.UNREGISTER_CONTENDER -> {
                    if (parameter is UnregisterContenderParam) {
                        unregisterContender(parameter)
                    }
                }
            }
        } catch (e: Exception) {
            logger.error("Failed to handle action ${action} with parameter ${parameter}", e)
        } finally {
            try {
                broadcastQueuedScorings()
            } catch (e: Exception) {}

            lock.unlock()
        }
    }

    override fun getScorings(contenderId: Int): List<ScoringDto>? {
        lock.lock()
        try {
            val contender = contenders[contenderId]
            return listOfNotNull(contender?.scoring)
        } finally {
            lock.unlock()
        }
    }

    override fun getCurrentPoints(problemId: Int): List<CurrentPointsDto>? {
        lock.lock()
        try {
            val problem = problems[problemId]
            return problem?.getCurrentPoints()
        } finally {
            lock.unlock()
        }
    }

    private fun registerContest(parameter: RegisterContestParam) {
        if (contests.containsKey(parameter.contestId)) {
            return
        }

        contests.put(parameter.contestId, ContestData(parameter.contestId))

        problemRepository.findAllByContestId(parameter.contestId).forEach {
            registerProblem(RegisterProblemParam(it.id!!, it.contest?.id!!, it.points, PointsMode.SHARED, it.flashBonus, PointsMode.SHARED))
        }

        contenderRepository.findAllRegisteredByContestId(parameter.contestId).forEach {
            registerContender(RegisterContenderParam(it.id!!, it.contest?.id!!, it.compClass?.id!!))
        }
    }

    private fun unregisterContest(parameter: UnregisterContestParam) {
        throw NotImplementedError()
    }

    private fun registerProblem(parameter: RegisterProblemParam) {
        val contest = contests[parameter.contestId]
        val problem = problems[parameter.problemId]

        if (problem != null) {
            problem.updatePoints(parameter.points,
                    PointsMode.SHARED,
                    parameter.flashBonus,
                    PointsMode.SHARED)
        } else {
            problems.put(parameter.problemId, ProblemData(
                    parameter.problemId,
                    contest!!,
                    parameter.points,
                    parameter.pointsMode,
                    parameter.flashBonus,
                    parameter.flashBonusMode))
        }
    }

    private fun unregisterProblem(parameter: UnregisterProblemParam) {
        val problem = problems[parameter.problemId]

        problem?.ticks?.toMutableList()?.forEach {
            unregisterTick(UnregisterTickParam(it.id))
        }

        problems.remove(parameter.problemId)
    }

    private fun registerTick(parameter: RegisterTickParam) {
        val contender = contenders[parameter.contenderId]
        val problem = problems[parameter.problemId]
        val tick = ticks.get(parameter.tickId)

        if (tick != null) {
            tick.flash = parameter.isFlash
        } else {
            ticks.put(parameter.tickId, TickData(
                    parameter.tickId,
                    contender!!,
                    problem!!,
                    parameter.isFlash))
        }
    }

    private fun unregisterTick(parameter: UnregisterTickParam) {
        val tick = ticks[parameter.tickId]
        tick?.purge()
        ticks.remove(parameter.tickId)
    }

    private fun registerContender(parameter: RegisterContenderParam) {
        if (contenders.containsKey(parameter.contenderId)) {
            val contender = contenders[parameter.contenderId]
            contender?.compClass = parameter.compClassId
        }

        val contest = contests[parameter.contestId]

        contenders.put(parameter.contenderId, ContenderData(
                parameter.contenderId,
                contest!!,
                parameter.compClassId,
                { contestId: Int, scoring: ScoringDto -> enqueueScoringBroadcast(contestId, scoring) }))

        for (tick in tickRepository.findAllByContenderId(parameter.contenderId, PageRequest.of(0, Int.MAX_VALUE))) {
            registerTick(RegisterTickParam(
                    tick.id!!,
                    tick.problem?.id!!,
                    parameter.contenderId,
                    tick.isFlash))
        }
    }

    private fun unregisterContender(parameter: UnregisterContenderParam) {
        val contender = contenders[parameter.contenderId]

        contender?.ticks?.toMutableList()?.forEach {
            unregisterTick(UnregisterTickParam(it.id))
        }

        contender?.purge()

        contenders.remove(parameter.contenderId)
    }

    private fun enqueueScoringBroadcast(contestId: Int, scoring: ScoringDto) {
        queuedScoringBroadcasts.put(scoring.contenderId, Pair(contestId, scoring))
    }

    private fun broadcastQueuedScorings() {
        for ((contestId, scoring) in queuedScoringBroadcasts.values) {
            broadcastService.broadcast(contestId, scoring)
        }

        queuedScoringBroadcasts.clear()
    }
}
