package se.scoreboard.api

import io.swagger.annotations.Api
import io.swagger.annotations.ApiParam
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ColorDto
import se.scoreboard.service.ColorService
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Color"])
class ColorController @Autowired constructor(
        val colorService: ColorService) {

    @GetMapping("/color")
    @Transactional
    fun getColors(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = colorService.search(pageable)

    @GetMapping("/color/{id}")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getColor(@PathVariable("id") id: Int) = colorService.findById(id)

    @PostMapping("/color")
    @PreAuthorize("hasPermission(#color, 'create')")
    @Transactional
    fun createColor(@RequestBody color : ColorDto) = colorService.create(color)

    @PutMapping("/color/{id}")
    @PreAuthorize("hasPermission(#id, 'ColorDto', 'update') && hasPermission(#color, 'update')")
    @Transactional
    fun updateColor(
            @PathVariable("id") id: Int,
            @RequestBody color : ColorDto) = colorService.update(id, color)

    @DeleteMapping("/color/{id}")
    @PreAuthorize("hasPermission(#id, 'ColorDto', 'delete')")
    @Transactional
    fun deleteColor(@PathVariable("id") id: Int) = colorService.delete(id)
}
