package se.scoreboard.mapper

import org.mapstruct.InheritInverseConfiguration
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Mappings
import se.scoreboard.data.domain.Series
import se.scoreboard.dto.SeriesDto

@Mapper
interface SeriesMapper : AbstractMapper<Series, SeriesDto> {
    @Mappings(
        Mapping(source = "organizer.id", target = "organizerId")
    )
    override fun convertToDto(source: Series): SeriesDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "contests", ignore = true)
    )
    override fun convertToEntity(source: SeriesDto): Series
}