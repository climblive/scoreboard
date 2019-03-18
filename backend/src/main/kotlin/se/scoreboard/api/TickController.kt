package se.scoreboard.api

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.TickDto
import se.scoreboard.service.TickService

@RestController
@CrossOrigin
@RequestMapping("/api")
class TickController @Autowired constructor(
        val tickService: TickService) {

    @GetMapping("/tick")
    fun getTicks() = tickService.findAll()

    @GetMapping("/tick/{id}")
    fun getTick(@PathVariable("id") id: Int) = tickService.findById(id)

    @PostMapping("/tick")
    fun createTick(@RequestBody tick : TickDto) = tickService.create(tick)

    @PutMapping("/tick/{id}")
    fun updateTick(
            @PathVariable("id") id: Int,
            @RequestBody tick : TickDto) = tickService.update(id, tick)

    @DeleteMapping("/tick/{id}")
    fun deleteTick(@PathVariable("id") id: Int) = tickService.delete(id)
}
