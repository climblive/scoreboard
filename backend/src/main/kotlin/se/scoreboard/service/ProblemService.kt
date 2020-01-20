package se.scoreboard.service

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Problem
import se.scoreboard.data.repo.ContestRepository
import se.scoreboard.data.repo.ProblemRepository
import se.scoreboard.dto.ProblemDto
import se.scoreboard.mapper.AbstractMapper
import javax.transaction.Transactional

@Service
class ProblemService @Autowired constructor(
    private val problemRepository: ProblemRepository,
    private val contestRepository: ContestRepository,
    override var entityMapper: AbstractMapper<Problem, ProblemDto>) : AbstractDataService<Problem, ProblemDto, Int>(
        problemRepository) {

    companion object {
        var logger = LoggerFactory.getLogger(ProblemService::class.java)
    }

    private enum class ProblemAdjustmentAction {
        MAKE_ROOM,
        MOVE_DOWN,
        CLOSE_GAP
    }

    @Transactional
    override fun create(problem: ProblemDto): ResponseEntity<ProblemDto> {
        handleRenumbering(problem.contestId, ProblemAdjustmentAction.MAKE_ROOM, problem.number)
        return super.create(problem)
    }

    @Transactional
    override fun update(id: Int, problem: ProblemDto): ResponseEntity<ProblemDto> {
        val old = fetchEntity(id)
        val oldNumber = old.number
        val requestedProblemNumber = problem.number

        val action: ProblemAdjustmentAction? = if (requestedProblemNumber == oldNumber) {
            null
        } else if (requestedProblemNumber > oldNumber) {
            ProblemAdjustmentAction.MOVE_DOWN
        } else {
            ProblemAdjustmentAction.MAKE_ROOM
        }

        problem.number = Int.MIN_VALUE
        super.update(id, problem)
        problem.number = requestedProblemNumber

        action?.let { handleRenumbering(problem.contestId, it, requestedProblemNumber) }

        return super.update(id, problem)
    }

    private fun handleRenumbering(contestId: Int?, action: ProblemAdjustmentAction, affectedProblemNumber: Int) {
        val contest = contestRepository.findByIdOrNull(contestId)

        val problems: List<Problem>? = when (action) {
            ProblemAdjustmentAction.MAKE_ROOM -> contest?.problems?.filter { it.number >= affectedProblemNumber  }
            ProblemAdjustmentAction.MOVE_DOWN -> contest?.problems?.filter { it.number in 1..affectedProblemNumber }
            ProblemAdjustmentAction.CLOSE_GAP -> contest?.problems?.filter { it.number > affectedProblemNumber }
        }?.sortedBy { it.number }

        if (problems.isNullOrEmpty()) {
            return
        }

        var startNumber: Int = when (action) {
            ProblemAdjustmentAction.MAKE_ROOM -> affectedProblemNumber + 1
            ProblemAdjustmentAction.MOVE_DOWN -> (problems.map { it.number }.min() ?: 0) - 1
            ProblemAdjustmentAction.CLOSE_GAP -> affectedProblemNumber
        }

        val intentLog: List<Pair<Int, Problem>>? = problems.map { Pair(startNumber++, it) }

        when (action) {
            ProblemAdjustmentAction.MAKE_ROOM -> intentLog?.asReversed()
            ProblemAdjustmentAction.MOVE_DOWN, ProblemAdjustmentAction.CLOSE_GAP -> intentLog
        }?.forEach {
            it.second.number = it.first
            entityManager.flush()
        }
    }

    override fun afterDelete(old: Problem) {
        entityManager.flush()
        handleRenumbering(old.contest?.id, ProblemAdjustmentAction.CLOSE_GAP, old.number)
    }
}