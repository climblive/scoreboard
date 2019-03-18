package se.scoreboard.mapper

import org.mapstruct.Mapper
import se.scoreboard.data.domain.Organizer
import se.scoreboard.dto.OrganizerDto

@Mapper
interface OrganizerMapper : AbstractMapper<Organizer, OrganizerDto>