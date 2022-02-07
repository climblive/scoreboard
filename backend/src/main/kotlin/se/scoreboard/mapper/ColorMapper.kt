package se.scoreboard.mapper

import org.mapstruct.*
import se.scoreboard.data.domain.Color
import se.scoreboard.data.domain.Organizer
import se.scoreboard.dto.ColorDto

@Mapper(componentModel = "spring")
abstract class ColorMapper : AbstractMapper<Color, ColorDto>() {
    @Mappings(
            Mapping(source = "organizer.id", target = "organizerId")
    )
    abstract override fun convertToDto(source: Color): ColorDto

    @InheritInverseConfiguration(name = "convertToDto")
    abstract override fun convertToEntity(source: ColorDto): Color
}
