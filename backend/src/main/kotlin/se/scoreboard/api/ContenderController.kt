package se.scoreboard.api

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ContenderDto
import se.scoreboard.dto.ScoreboardListItemDto
import se.scoreboard.dto.TickDto
import se.scoreboard.mapper.TickMapper
import se.scoreboard.service.ContenderService

@RestController
@CrossOrigin
@RequestMapping("/api")
class ContenderController @Autowired constructor(
        val contenderService: ContenderService) {

    private lateinit var tickMapper: TickMapper

    init {
        tickMapper = Mappers.getMapper(TickMapper::class.java)
    }

    @GetMapping("/contender")
    fun getContenders(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = contenderService.search(filter, pageable)

    @GetMapping("/contender/{id}")
    fun getContender(@PathVariable("id") id: Int) = contenderService.findById(id)

    @GetMapping("/contender/findByCode")
    fun getContenderByCode(@RequestParam("code") code: String) = contenderService.findByCode(code)

    @GetMapping("/contender/{id}/tick")
    fun getContenderTicks(@PathVariable("id") id: Int) : List<TickDto> {
        return contenderService.fetchEntity(id).ticks.map { tick -> tickMapper.convertToDto(tick) }
    }

    @PostMapping("/contender")
    fun createContender(@RequestBody contender : ContenderDto) = contenderService.create(contender)

    @PutMapping("/contender/{id}")
    fun updateContender(@PathVariable("id") id: Int,
                        @RequestBody contender : ContenderDto) = contenderService.update(id, contender)

    @DeleteMapping("/contender/{id}")
    fun deleteContender(@PathVariable("id") id: Int) = contenderService.delete(id)
}
