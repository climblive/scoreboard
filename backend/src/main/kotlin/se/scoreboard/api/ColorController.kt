package se.scoreboard.api

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ColorDto
import se.scoreboard.service.ColorService
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
class ColorController @Autowired constructor(
        val colorService: ColorService) {

    @GetMapping("/color")
    @Transactional
    fun getColors(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = colorService.search(filter, pageable)

    @GetMapping("/color/{id}")
    @Transactional
    fun getColor(@PathVariable("id") id: Int) = colorService.findById(id)

    @PostMapping("/color")
    @Transactional
    fun createColor(@RequestBody color : ColorDto) = colorService.create(color)

    @PutMapping("/color/{id}")
    @Transactional
    fun updateColor(
            @PathVariable("id") id: Int,
            @RequestBody color : ColorDto) = colorService.update(id, color)

    @DeleteMapping("/color/{id}")
    @Transactional
    fun deleteColor(@PathVariable("id") id: Int) = colorService.delete(id)
}
