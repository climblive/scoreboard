package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.Raffle
import se.scoreboard.data.domain.RaffleWinner
import se.scoreboard.data.domain.extension.isRegistered
import se.scoreboard.data.repo.RaffleRepository
import se.scoreboard.data.repo.RaffleWinnerRepository
import se.scoreboard.dto.RaffleDto
import se.scoreboard.dto.RaffleWinnerDto
import se.scoreboard.exception.WebException
import se.scoreboard.mapper.AbstractMapper
import java.time.OffsetDateTime

@Service
class RaffleService @Autowired constructor(
    raffleRepository: RaffleRepository,
    private val raffleWinnerRepository: RaffleWinnerRepository,
    private val broadcastService: BroadcastService,
    override var entityMapper: AbstractMapper<Raffle, RaffleDto>) : AbstractDataService<Raffle, RaffleDto, Int>(
        raffleRepository) {

    override fun onCreate(phase: Phase, new: Raffle) {
        when (phase) {
            Phase.AFTER -> onAnyChange(new)
            else -> {}
        }
    }

    override fun onUpdate(phase: Phase, old: Raffle, new: Raffle) {
        when (phase) {
            Phase.AFTER -> onAnyChange(new)
            else -> {}
        }
    }

    override fun onDelete(phase: Phase, old: Raffle) {
        when (phase) {
            Phase.AFTER -> {
                old.isActive = false
                onAnyChange(old)
            }
            else -> {}
        }
    }

    private fun onAnyChange(raffle: Raffle) {
        if (raffle.isActive) {
            val otherRaffles = raffle.contest?.raffles?.filter { it.id != raffle.id }

            otherRaffles?.forEach { otherRaffle ->
                if (otherRaffle.isActive) {
                    otherRaffle.isActive = false
                    broadcastService.broadcast(otherRaffle)
                }
            }
        }

        broadcastService.broadcast(raffle)
    }

    fun drawWinner(raffleId: Int): RaffleWinner {
        val raffle = fetchEntity(raffleId)
        val winners = raffle.winners.map { winner -> winner.contender?.id }
        val contendersInTheDraw = raffle.contest?.contenders?.filter { contender -> contender.isRegistered() && !(contender.id in winners) }

        contendersInTheDraw?.takeIf { it.isNotEmpty() }?.let { draw ->
            var winner: RaffleWinner = RaffleWinner(
                    null,
                    entityManager.getReference(Raffle::class.java, raffleId),
                    entityManager.getReference(Contender::class.java, draw.random().id!!),
                    OffsetDateTime.now())

            winner = raffleWinnerRepository.save(winner)
            entityManager.flush()
            broadcastService.broadcast(winner)
            return winner
        } ?: throw WebException(HttpStatus.NOT_FOUND, "All winners have been drawn")
    }
}