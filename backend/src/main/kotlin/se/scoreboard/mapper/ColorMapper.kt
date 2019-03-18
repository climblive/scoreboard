package se.scoreboard.mapper

import org.mapstruct.Mapper
import se.scoreboard.data.domain.Color
import se.scoreboard.dto.ColorDto

@Mapper
interface ColorMapper : AbstractMapper<Color, ColorDto>