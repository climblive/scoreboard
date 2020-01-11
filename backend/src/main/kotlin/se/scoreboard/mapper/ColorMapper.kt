package se.scoreboard.mapper

import org.mapstruct.InheritInverseConfiguration
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Mappings
import se.scoreboard.data.domain.Color
import se.scoreboard.dto.ColorDto

@Mapper(componentModel = "spring")
abstract class ColorMapper : AbstractMapper<Color, ColorDto> {
    @Mappings(
            Mapping(source = "organizer.id", target = "organizerId")
    )
    abstract override fun convertToDto(source: Color): ColorDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "problems", ignore = true)
    )
    abstract override fun convertToEntity(source: ColorDto): Color
}
