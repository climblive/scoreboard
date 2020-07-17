package se.scoreboard.engine

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Tick
import se.scoreboard.data.repo.ContenderRepository
import se.scoreboard.data.repo.ContestRepository
import se.scoreboard.data.repo.ProblemRepository
import se.scoreboard.data.repo.TickRepository
import se.scoreboard.dto.ScoringDto
import se.scoreboard.service.BroadcastService
import javax.annotation.PostConstruct

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

    private var queuedScorings: MutableMap<Int, Pair<Int, ScoringDto>> = mutableMapOf()

    private var contests: MutableMap<Int, ContestData> = mutableMapOf()
    private var problems: MutableMap<Int, ProblemData> = mutableMapOf()
    private var ticks: MutableMap<Int, TickData> = mutableMapOf()
    private var contenders: MutableMap<Int, ContenderData> = mutableMapOf()

    @PostConstruct
    fun postConstruct() {
        for (contest in contestRepository.findAll()) {
            contests.put(contest.id!!, ContestData(contest.id!!))
        }

        for (problem in problemRepository.findAll()) {
            val contest = contests[problem.contest?.id]
            problems.put(problem.id!!, ProblemData(
                    problem.id!!,
                    contest!!,
                    problem.points,
                    true,
                    problem.flashBonus,
                    false
            ))
        }

        for (contender in contenderRepository.findAll()) {
            if (contender.compClass != null) {
                val contest = contests[contender.contest?.id]
                contenders.put(contender.id!!, ContenderData(contender.id!!, contest!!, contender.compClass?.id!!,
                        {contestId: Int, scoring: ScoringDto -> queueScoring(contestId, scoring) }))
            }
        }

        for (tick in tickRepository.findAll()) {
            val contender = contenders[tick.contender?.id!!]
            val problem = problems[tick.problem?.id!!]
            ticks.put(tick.id!!, TickData(tick.id!!, contender!!, problem!!, tick.isFlash))
        }

        for (problem in problems.values) {
            problem.recalculateAllValues()
        }

        for (contender in contenders.values) {
            contender.recalculateScoring(true)
        }

        ProblemData.broadcastService = broadcastService
        queuedScorings.clear()
    }

    override fun registerTick(tick: Tick) {
        val contender = contenders[tick.contender?.id!!]
        val problem = problems[tick.problem?.id!!]
        ticks.put(tick.id!!, TickData(tick.id!!, contender!!, problem!!, tick.isFlash))
        dispatchQueuedScorings()
    }

    override fun unregisterTick(tickId: Int) {
        val tick = ticks[tickId]
        val contender = tick?.getContender()
        tick?.purge()
        ticks.remove(tickId)
        contender?.recalculateScoring()
        dispatchQueuedScorings()
    }

    override fun getScoring(contenderId: Int): ScoringDto? {
        val contender = contenders[contenderId]
        return contender?.makeScoring()
    }

    private fun queueScoring(contestId: Int, scoring: ScoringDto) {
        queuedScorings.put(scoring.contenderId, Pair(contestId, scoring))
    }

    private fun dispatchQueuedScorings() {
        for ((contestId, scoring) in queuedScorings.values) {
            broadcastService.broadcast(contestId, scoring)
        }

        queuedScorings.clear()
    }
}
