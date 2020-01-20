package se.scoreboard.mapper

import org.mapstruct.*
import se.scoreboard.data.domain.Organizer
import se.scoreboard.data.domain.Series
import se.scoreboard.dto.SeriesDto

@Mapper(componentModel = "spring")
abstract class SeriesMapper : AbstractMapper<Series, SeriesDto>() {
    @Mappings(
        Mapping(source = "organizer.id", target = "organizerId")
    )
    abstract override fun convertToDto(source: Series): SeriesDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "contests", ignore = true)
    )
    abstract override fun convertToEntity(source: SeriesDto): Series

    @AfterMapping
    fun afterMapping(source: SeriesDto, @MappingTarget target: Series) {
        target.organizer = entityManager.getReference(Organizer::class.java, source.organizerId)
    }
}