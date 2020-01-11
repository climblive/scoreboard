package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Organizer
import se.scoreboard.data.repo.OrganizerRepository
import se.scoreboard.dto.OrganizerDto
import se.scoreboard.mapper.AbstractMapper

@Service
class OrganizerService @Autowired constructor(
    organizerRepository: OrganizerRepository,
    override var entityMapper: AbstractMapper<Organizer, OrganizerDto>) : AbstractDataService<Organizer, OrganizerDto, Int>(
        organizerRepository)