package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ColorDto
import se.scoreboard.mapper.ColorMapper
import se.scoreboard.service.ColorService
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Colors"])
class ColorController @Autowired constructor(
        val colorService: ColorService,
        private val colorMapper: ColorMapper) {

    @GetMapping("/colors/{id}")
    @PreAuthorize("hasPermission(#id, 'Color', 'read')")
    @Transactional
    fun getColor(@PathVariable("id") id: Int) = colorService.findById(id)

    @PutMapping("/colors/{id}")
    @PreAuthorize("hasPermission(#id, 'Color', 'write')")
    @Transactional
    fun updateColor(
            @PathVariable("id") id: Int,
            @RequestBody color : ColorDto): ResponseEntity<ColorDto> {
        val old = colorService.fetchEntity(id)

        val entity = colorMapper.convertToEntity(color)
        entity.organizer = old.organizer

        return colorService.update(id, entity)
    }

    @DeleteMapping("/colors/{id}")
    @PreAuthorize("hasPermission(#id, 'Color', 'delete')")
    @Transactional
    fun deleteColor(@PathVariable("id") id: Int) = colorService.delete(id)
}
