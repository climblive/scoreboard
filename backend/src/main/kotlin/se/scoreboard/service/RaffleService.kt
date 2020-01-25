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
    override var entityMapper: AbstractMapper<Raffle, RaffleDto>) : AbstractDataService<Raffle, RaffleDto, Int>(
        raffleRepository) {

    fun drawWinner(raffleId: Int): RaffleWinner {
        val raffle = fetchEntity(raffleId)
        val winners = raffle.winners.map { winner -> winner.contender?.id }
        val contendersInTheDraw = raffle.contest?.contenders?.filter { contender -> contender.isRegistered() && !(contender.id in winners) }

        contendersInTheDraw?.takeIf { it.isNotEmpty() }?.let { draw ->
            val winner: RaffleWinner = RaffleWinner(
                    null,
                    entityManager.getReference(Raffle::class.java, raffleId),
                    entityManager.getReference(Contender::class.java, draw.random().id!!),
                    OffsetDateTime.now())

            return raffleWinnerRepository.save(winner)
        } ?: throw WebException(HttpStatus.NOT_FOUND, "All winners have been drawn")
    }
}