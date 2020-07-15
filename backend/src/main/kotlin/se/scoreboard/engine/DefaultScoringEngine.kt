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
            problems.put(problem.id!!, ProblemData(
                    problem.id!!,
                    problem.points,
                    true,
                    problem.flashBonus,
                    false
            ))
        }

        for (contender in contenderRepository.findAll()) {
            if (contender.compClass != null) {
                val contest = contests[contender.contest?.id]
                contenders.put(contender.id!!, ContenderData(contender.id!!, contest!!, contender.compClass?.id!!))
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
    }

    override fun registerTick(tick: Tick) {
        val contender = contenders[tick.contender?.id!!]
        val problem = problems[tick.problem?.id!!]
        ticks.put(tick.id!!, TickData(tick.id!!, contender!!, problem!!, tick.isFlash))
    }

    override fun unregisterTick(tickId: Int) {
        val tick = ticks[tickId]
        tick?.purge()
        ticks.remove(tickId)
    }

    override fun getScoring(contenderId: Int): ScoringDto? {
        val contender = contenders[contenderId]
        return ScoringDto(
                contenderId,
                0,
                0,
                contender?.getScore() ?: 0,
                contender?.getPlacement() ?: 0
        )
    }
}
