package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import se.scoreboard.Messages
import se.scoreboard.data.domain.Color
import se.scoreboard.data.repo.ColorRepository
import se.scoreboard.dto.ColorDto
import se.scoreboard.exception.WebException
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.validation.RgbColorValidator

@Service
class ColorService @Autowired constructor(
    colorRepository: ColorRepository,
    override var entityMapper: AbstractMapper<Color, ColorDto>) : AbstractDataService<Color, ColorDto, Int>(colorRepository) {

    override fun onCreate(phase: Phase, new: Color) {
        when (phase) {
            Phase.BEFORE -> beforeAnyUpdate(new)
            else -> {}
        }
    }

    override fun onUpdate(phase: Phase, old: Color, new: Color) {
        when (phase) {
            Phase.BEFORE -> beforeAnyUpdate(new)
            else -> {}
        }
    }

    fun beforeAnyUpdate(color: Color) {
        if (color.rgbPrimary?.let { RgbColorValidator.validate(it) } == false) {
            throw WebException(HttpStatus.BAD_REQUEST, Messages.BAD_COLOR)
        }

        if (color.rgbSecondary?.let { RgbColorValidator.validate(it) } == false) {
            throw WebException(HttpStatus.BAD_REQUEST, Messages.BAD_COLOR)
        }
    }
}

