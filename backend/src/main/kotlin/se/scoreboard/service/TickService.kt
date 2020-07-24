package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.support.TransactionSynchronizationAdapter
import org.springframework.transaction.support.TransactionSynchronizationManager
import se.scoreboard.Messages
import se.scoreboard.afterCommit
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.Tick
import se.scoreboard.data.domain.extension.allowedToAlterTick
import se.scoreboard.data.repo.TickRepository
import se.scoreboard.dto.ContenderDto
import se.scoreboard.dto.TickDto
import se.scoreboard.engine.ActionType
import se.scoreboard.engine.ScoringEngine
import se.scoreboard.engine.params.RegisterTickParam
import se.scoreboard.engine.params.UnregisterTickParam
import se.scoreboard.exception.WebException
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.nowWithoutNanos

@Service
class TickService @Autowired constructor(
    tickRepository: TickRepository,
    private val scoringEngine: ScoringEngine,
    val broadcastService : BroadcastService,
    override var entityMapper: AbstractMapper<Tick, TickDto>) : AbstractDataService<Tick, TickDto, Int>(tickRepository) {

    init {
        addConstraints(TickDto::contenderId.name, TickDto::contenderId, null, AttributeConstraintType.IMMUTABLE)
        addConstraints(TickDto::problemId.name, TickDto::problemId, null, AttributeConstraintType.IMMUTABLE)
    }

    private fun checkTimeAllowed(contender: Contender) {
        val compClass = contender.compClass ?: throw WebException(HttpStatus.CONFLICT, Messages.CONTENDER_NOT_REGISTERED)

        if (!compClass.allowedToAlterTick()) {
            throw WebException(HttpStatus.FORBIDDEN, Messages.CONTEST_NOT_IN_PROGRESS)
        }
    }

    override fun onCreate(phase: Phase, new: Tick) {
        when (phase) {
            Phase.BEFORE -> onAnyChange(new)
            Phase.AFTER -> {
                afterCreateAndUpdate(new)
                broadcastService.broadcast(new.contender!!)
            }
        }
    }

    override fun onUpdate(phase: Phase, old: Tick, new: Tick) {
        when (phase) {
            Phase.BEFORE -> onAnyChange(new)
            Phase.AFTER -> {
                afterCreateAndUpdate(new)
                broadcastService.broadcast(new.contender!!)
            }
        }
    }

    override fun onDelete(phase: Phase, old: Tick) {
        val contender = old.contender!!
        when (phase) {
            Phase.BEFORE -> checkTimeAllowed(contender)
            Phase.AFTER -> {
                contender.ticks.remove(old)
                afterCommit { scoringEngine.dispatch(ActionType.UNREGISTER_TICK, UnregisterTickParam(old.id!!)) }
                broadcastService.broadcast(contender)
            }
        }
    }

    private fun afterCreateAndUpdate(tick: Tick) {
        afterCommit { scoringEngine.dispatch(ActionType.REGISTER_TICK, RegisterTickParam(tick.id!!, tick.problem?.id!!, tick.contender?.id!!, tick.isFlash)) }
    }

    private fun onAnyChange(tick: Tick) {
        tick.timestamp = nowWithoutNanos()
        checkTimeAllowed(tick.contender!!)
    }
}