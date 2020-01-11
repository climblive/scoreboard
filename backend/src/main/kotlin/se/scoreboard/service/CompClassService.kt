package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.CompClass
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.repo.CompClassRepository
import se.scoreboard.dto.CompClassDto
import se.scoreboard.mapper.AbstractMapper

@Service
class CompClassService @Autowired constructor(
    compClassRepository: CompClassRepository,
    override var entityMapper: AbstractMapper<CompClass, CompClassDto>) : AbstractDataService<CompClass, CompClassDto, Int>(
        compClassRepository) {

    override fun handleNested(entity: CompClass, dto: CompClassDto) {
        entity.contest = entityManager.getReference(Contest::class.java, dto.contestId)
    }
}