package se.scoreboard.mapper

import org.mapstruct.InheritInverseConfiguration
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Mappings
import se.scoreboard.data.domain.Location
import se.scoreboard.dto.LocationDto

@Mapper
interface LocationMapper : AbstractMapper<Location, LocationDto> {
    @Mappings(
            Mapping(source = "organizer.id", target = "organizerId")
    )
    override fun convertToDto(source: Location): LocationDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "contests", ignore = true)
    )
    override fun convertToEntity(source: LocationDto): Location
}