package se.scoreboard.mapper

import org.mapstruct.*
import se.scoreboard.data.domain.Contest
import se.scoreboard.dto.ContestDto

@Mapper
interface ContestMapper : AbstractMapper<Contest, ContestDto> {
    @Mappings(
        Mapping(source = "location.id", target = "locationId"),
        Mapping(source = "organizer.id", target = "organizerId")
    )
    override fun convertToDto(source: Contest): ContestDto
}