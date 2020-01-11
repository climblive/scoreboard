package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.Problem
import se.scoreboard.data.domain.Tick
import se.scoreboard.data.repo.TickRepository
import se.scoreboard.dto.TickDto
import se.scoreboard.mapper.AbstractMapper

@Service
class TickService @Autowired constructor(
    tickRepository: TickRepository,
    override var entityMapper: AbstractMapper<Tick, TickDto>) : AbstractDataService<Tick, TickDto, Int>(tickRepository) {

    override fun handleNested(entity: Tick, dto: TickDto) {
        entity.contender = entityManager.getReference(Contender::class.java, dto.contenderId)
        entity.problem = entityManager.getReference(Problem::class.java, dto.problemId)
    }
}