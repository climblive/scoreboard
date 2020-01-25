package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.RaffleWinner
import se.scoreboard.data.repo.RaffleWinnerRepository
import se.scoreboard.dto.RaffleWinnerDto
import se.scoreboard.mapper.AbstractMapper

@Service
class RaffleWinnerService @Autowired constructor(
    private val raffleWinnerRepository: RaffleWinnerRepository,
    override var entityMapper: AbstractMapper<RaffleWinner, RaffleWinnerDto>,
    val broadcastService: BroadcastService) : AbstractDataService<RaffleWinner, RaffleWinnerDto, Int>(
        raffleWinnerRepository) {

    override fun onCreate(phase: Phase, new: RaffleWinner) {
        when (phase) {
            Phase.AFTER -> broadcastService.broadcast(new)
            else -> {}
        }
    }
}