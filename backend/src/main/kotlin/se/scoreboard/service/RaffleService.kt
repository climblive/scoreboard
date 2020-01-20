package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Raffle
import se.scoreboard.data.repo.RaffleRepository
import se.scoreboard.dto.RaffleDto
import se.scoreboard.mapper.AbstractMapper

@Service
class RaffleService @Autowired constructor(
    private val raffleRepository: RaffleRepository,
    override var entityMapper: AbstractMapper<Raffle, RaffleDto>) : AbstractDataService<Raffle, RaffleDto, Int>(
        raffleRepository)