package se.scoreboard.api

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import se.scoreboard.data.domain.extension.allowedToAlterContender
import se.scoreboard.dto.ContenderDto
import se.scoreboard.dto.TickDto
import se.scoreboard.exception.WebException
import se.scoreboard.mapper.TickMapper
import se.scoreboard.service.BroadcastService
import se.scoreboard.service.CompClassService
import se.scoreboard.service.ContenderService

@RestController
@CrossOrigin
@RequestMapping("/api")
class ContenderController @Autowired constructor(
        val contenderService: ContenderService,
        val compClassService: CompClassService,
        val broadcastService: BroadcastService) {

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
                        @RequestBody contender : ContenderDto): ContenderDto {
        val compClass = compClassService.fetchEntity(contender.compClassId!!)
        if(!compClass.allowedToAlterContender()) {
            throw WebException(HttpStatus.FORBIDDEN, "The competition is not in progress");

        }
        val newContender = contenderService.update(id, contender)
        val entity = contenderService.fetchEntity(id)
        broadcastService.broadcast(entity)
        return newContender
    }

    @DeleteMapping("/contender/{id}")
    fun deleteContender(@PathVariable("id") id: Int) = contenderService.delete(id)
}
