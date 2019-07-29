package se.scoreboard.mapper

import org.mapstruct.InheritInverseConfiguration
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Mappings
import se.scoreboard.data.domain.Contest
import se.scoreboard.dto.ContestDto

@Mapper
interface ContestMapper : AbstractMapper<Contest, ContestDto> {
    @Mappings(
        Mapping(source = "location.id", target = "locationId"),
        Mapping(source = "organizer.id", target = "organizerId"),
        Mapping(source = "series.id", target = "seriesId")
    )
    override fun convertToDto(source: Contest): ContestDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "compClasses", ignore = true),
            Mapping(target = "contenders", ignore = true),
            Mapping(target = "problems", ignore = true)
    )
    override fun convertToEntity(source: ContestDto): Contest
}