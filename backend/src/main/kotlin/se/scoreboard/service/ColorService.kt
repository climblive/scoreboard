package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Color
import se.scoreboard.data.repo.ColorRepository
import se.scoreboard.dto.ColorDto
import se.scoreboard.mapper.AbstractMapper

@Service
class ColorService @Autowired constructor(
    colorRepository: ColorRepository,
    override var entityMapper: AbstractMapper<Color, ColorDto>) : AbstractDataService<Color, ColorDto, Int>(colorRepository)