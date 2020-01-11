package se.scoreboard.mapper

import org.mapstruct.InheritInverseConfiguration
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Mappings
import se.scoreboard.data.domain.Organizer
import se.scoreboard.dto.OrganizerDto

@Mapper(componentModel = "spring")
abstract class OrganizerMapper : AbstractMapper<Organizer, OrganizerDto> {
    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "users", ignore = true),
            Mapping(target = "contests", ignore = true),
            Mapping(target = "colors", ignore = true),
            Mapping(target = "locations", ignore = true),
            Mapping(target = "series", ignore = true)
    )
    abstract override fun convertToEntity(source: OrganizerDto): Organizer
}