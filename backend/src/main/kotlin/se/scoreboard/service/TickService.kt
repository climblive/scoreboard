package se.scoreboard.service

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.Problem
import se.scoreboard.data.domain.Tick
import se.scoreboard.data.repo.TickRepository
import se.scoreboard.dto.TickDto
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.mapper.TickMapper

@Service
class TickService @Autowired constructor(
    tickRepository: TickRepository) : AbstractDataService<Tick, TickDto, Int>(tickRepository) {

    override lateinit var entityMapper: AbstractMapper<Tick, TickDto>

    init {
        entityMapper = Mappers.getMapper(TickMapper::class.java)
    }

    override fun handleNested(entity: Tick, dto: TickDto) {
        entity.contender = entityManager.getReference(Contender::class.java, dto.contenderId)
        entity.problem = entityManager.getReference(Problem::class.java, dto.problemId)
    }
}