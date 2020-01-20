package se.scoreboard.mapper

import org.mapstruct.*
import se.scoreboard.data.domain.Location
import se.scoreboard.data.domain.Organizer
import se.scoreboard.dto.LocationDto

@Mapper(componentModel = "spring")
abstract class LocationMapper : AbstractMapper<Location, LocationDto>() {
    @Mappings(
            Mapping(source = "organizer.id", target = "organizerId")
    )
    abstract override fun convertToDto(source: Location): LocationDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "contests", ignore = true)
    )
    abstract override fun convertToEntity(source: LocationDto): Location

    @AfterMapping
    fun afterMapping(source: LocationDto, @MappingTarget target: Location) {
        target.organizer = entityManager.getReference(Organizer::class.java, source.organizerId)
    }
}