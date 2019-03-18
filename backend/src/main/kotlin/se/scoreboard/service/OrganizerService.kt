package se.scoreboard.service

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Organizer
import se.scoreboard.data.repo.OrganizerRepository
import se.scoreboard.dto.OrganizerDto
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.mapper.OrganizerMapper

@Service
class OrganizerService @Autowired constructor(
    organizerRepository: OrganizerRepository) : AbstractDataService<Organizer, OrganizerDto, Int>(
        organizerRepository) {

    override lateinit var entityMapper: AbstractMapper<Organizer, OrganizerDto>

    init {
        entityMapper = Mappers.getMapper(OrganizerMapper::class.java)
    }
}