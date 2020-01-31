package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.Tick
import se.scoreboard.data.domain.extension.allowedToAlterTick
import se.scoreboard.data.repo.TickRepository
import se.scoreboard.dto.TickDto
import se.scoreboard.exception.WebException
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.nowWithoutNanos
import java.time.OffsetDateTime

@Service
class TickService @Autowired constructor(
    tickRepository: TickRepository,
    val broadcastService : BroadcastService,
    override var entityMapper: AbstractMapper<Tick, TickDto>) : AbstractDataService<Tick, TickDto, Int>(tickRepository) {

    private fun checkTimeAllowed(contender: Contender) {
        val compClass = contender.compClass ?: throw WebException(HttpStatus.CONFLICT, "The contender is not registered")

        if (!compClass.allowedToAlterTick()) {
            throw WebException(HttpStatus.FORBIDDEN, "The competition is not in progress")
        }
    }

    override fun onCreate(phase: Phase, new: Tick) {
        when (phase) {
            Phase.BEFORE -> onAnyChange(new)
            Phase.AFTER -> broadcastService.broadcast(new.contender!!)
        }
    }

    override fun onUpdate(phase: Phase, old: Tick, new: Tick) {
        when (phase) {
            Phase.BEFORE -> onAnyChange(new)
            Phase.AFTER -> broadcastService.broadcast(new.contender!!)
        }
    }

    private fun onAnyChange(tick: Tick) {
        tick.timestamp = nowWithoutNanos()
        checkTimeAllowed(tick.contender!!)
    }

    override fun onDelete(phase: Phase, old: Tick) {
        val contender = old.contender!!
        when (phase) {
            Phase.BEFORE -> checkTimeAllowed(contender)
            Phase.AFTER -> {
                contender.ticks.remove(old)
                broadcastService.broadcast(contender)
            }
        }
    }
}