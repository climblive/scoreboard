package se.scoreboard.mapper

import org.mapstruct.InheritInverseConfiguration
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Mappings
import se.scoreboard.data.domain.Color
import se.scoreboard.dto.ColorDto

@Mapper
interface ColorMapper : AbstractMapper<Color, ColorDto> {
    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "problems", ignore = true)
    )
    override fun convertToEntity(source: ColorDto): Color
}
