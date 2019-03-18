package se.scoreboard.service

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.domain.Location
import se.scoreboard.data.domain.Organizer
import se.scoreboard.data.repo.ContestRepository
import se.scoreboard.dto.ContestDto
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.mapper.ContestMapper

@Service
class ContestService @Autowired constructor(
    contestRepository: ContestRepository) : AbstractDataService<Contest, ContestDto, Int>(
        contestRepository) {

    override lateinit var entityMapper: AbstractMapper<Contest, ContestDto>

    init {
        entityMapper = Mappers.getMapper(ContestMapper::class.java)
    }

    override fun handleNested(entity: Contest, contest: ContestDto) {
        entity.location = entityManager.getReference(Location::class.java, contest.locationId)
        entity.organizer = entityManager.getReference(Organizer::class.java, contest.organizerId)
    }
}