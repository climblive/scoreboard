package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.domain.Problem
import se.scoreboard.data.repo.ProblemRepository
import se.scoreboard.dto.ProblemDto
import se.scoreboard.mapper.AbstractMapper

@Service
class ProblemService @Autowired constructor(
    private val problemRepository: ProblemRepository,
    override var entityMapper: AbstractMapper<Problem, ProblemDto>) : AbstractDataService<Problem, ProblemDto, Int>(
        problemRepository) {

    private enum class ProblemAdjustmentAction {
        MAKE_ROOM,
        MOVE_DOWN,
        CLOSE_GAP
    }

    override fun onCreate(phase: Phase, new: Problem) {
        when (phase) {
            Phase.BEFORE -> handleRenumbering(new.contest, ProblemAdjustmentAction.MAKE_ROOM, new.number)
            else -> {}
        }
    }

    override fun onUpdate(phase: Phase, old: Problem, new: Problem) {
        when (phase) {
            Phase.BEFORE -> {
                val oldNumber = old.number
                val requestedProblemNumber = new.number

                val action: ProblemAdjustmentAction? = if (requestedProblemNumber == oldNumber) {
                    null
                } else if (requestedProblemNumber > oldNumber) {
                    ProblemAdjustmentAction.MOVE_DOWN
                } else {
                    ProblemAdjustmentAction.MAKE_ROOM
                }

                new.number = Int.MIN_VALUE
                problemRepository.save(new)
                new.number = requestedProblemNumber

                action?.let { handleRenumbering(new.contest, it, requestedProblemNumber) }
            }
            else -> {}
        }
    }

    override fun onDelete(phase: Phase, old: Problem) {
        when (phase) {
            Phase.AFTER -> handleRenumbering(old.contest, ProblemAdjustmentAction.CLOSE_GAP, old.number)
            else -> {}
        }
    }

    private fun handleRenumbering(contest: Contest?, action: ProblemAdjustmentAction, affectedProblemNumber: Int) {

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
            ProblemAdjustmentAction.MOVE_DOWN -> (problems.map { it.number }.minOrNull() ?: 0) - 1
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
}