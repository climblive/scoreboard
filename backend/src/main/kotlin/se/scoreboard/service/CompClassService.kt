package se.scoreboard.service

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.CompClass
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.repo.CompClassRepository
import se.scoreboard.dto.CompClassDto
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.mapper.CompClassMapper

@Service
class CompClassService @Autowired constructor(
    compClassRepository: CompClassRepository) : AbstractDataService<CompClass, CompClassDto, Int>(
        compClassRepository) {

    override lateinit var entityMapper: AbstractMapper<CompClass, CompClassDto>

    init {
        entityMapper = Mappers.getMapper(CompClassMapper::class.java)
    }

    override fun handleNested(entity: CompClass, dto: CompClassDto) {
        entity.contest = entityManager.getReference(Contest::class.java, dto.contestId)
    }
}