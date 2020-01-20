package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Tick
import se.scoreboard.data.repo.TickRepository
import se.scoreboard.dto.TickDto
import se.scoreboard.mapper.AbstractMapper

@Service
class TickService @Autowired constructor(
    tickRepository: TickRepository,
    override var entityMapper: AbstractMapper<Tick, TickDto>) : AbstractDataService<Tick, TickDto, Int>(tickRepository)