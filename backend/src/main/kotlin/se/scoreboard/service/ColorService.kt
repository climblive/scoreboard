package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import se.scoreboard.Messages
import se.scoreboard.data.domain.Color
import se.scoreboard.data.repo.ColorRepository
import se.scoreboard.dto.ColorDto
import se.scoreboard.exception.WebException
import se.scoreboard.getUserPrincipal
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.userHasRole
import se.scoreboard.validation.RgbColorValidator
import javax.servlet.http.HttpServletRequest
import javax.transaction.Transactional

@Service
class ColorService @Autowired constructor(
    private val colorRepository: ColorRepository,
    override var entityMapper: AbstractMapper<Color, ColorDto>) : AbstractDataService<Color, ColorDto, Int>(colorRepository) {

    @Transactional
    fun search(request: HttpServletRequest, pageable: Pageable?) : ResponseEntity<List<ColorDto>> {
        var result: List<ColorDto>

        var headers = HttpHeaders()
        headers.set("Access-Control-Expose-Headers", "Content-Range")
        var page: Page<Color> = Page.empty()

        val principal = getUserPrincipal()

        if (userHasRole("CONTENDER")) {
            page = colorRepository.findAllByContenderId(principal?.contenderId!!, pageable)
        }

        headers.set("Content-Range", "bytes %d-%d/%d".format(
                page.number * page.size, page.number * page.size + page.numberOfElements, page.totalElements))
        result = page.content.map { entity -> entityMapper.convertToDto(entity) }

        return ResponseEntity(result, headers, HttpStatus.OK)
    }

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

