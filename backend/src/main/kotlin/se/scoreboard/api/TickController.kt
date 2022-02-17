package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.TickDto
import se.scoreboard.mapper.TickMapper
import se.scoreboard.service.ContenderService
import se.scoreboard.service.TickService
import javax.persistence.EntityManager
import javax.transaction.Transactional

@RestController
@CrossOrigin
@Transactional
@RequestMapping("/api")
@Api(tags = ["Tick"])
class TickController @Autowired constructor(
        val tickService: TickService,
        val tickMapper: TickMapper,
        val contenderService: ContenderService,
        val entityManager: EntityManager) {

    @GetMapping("/tick/{id}")
    @PreAuthorize("hasPermission(#id, 'Tick', 'read')")
    @Transactional
    fun getTick(@PathVariable("id") id: Int) = tickService.findById(id)

    @PutMapping("/tick/{id}")
    @PreAuthorize("hasPermission(#id, 'Tick', 'write')")
    @Transactional
    fun updateTick(
            @PathVariable("id") id: Int,
            @RequestBody tick : TickDto): ResponseEntity<TickDto> {
        val old = tickService.fetchEntity(id)
        val contender = contenderService.fetchEntity(old.contender?.id!!)

        val entity = tickMapper.convertToEntity(tick)
        entity.contest = old.contest
        entity.contender = contender
        entity.organizer = old.organizer

        contender.ticks.removeIf { it.id == id }
        contender.ticks.add(entity)

        return tickService.update(id, entity)
    }

    @DeleteMapping("/tick/{id}")
    @PreAuthorize("hasPermission(#id, 'Tick', 'delete')")
    @Transactional
    fun deleteTick(@PathVariable("id") id: Int): ResponseEntity<TickDto> {
        val old = tickService.fetchEntity(id)
        val contender = contenderService.fetchEntity(old.contender?.id!!)

        contender.ticks.removeIf { it.id == id }

        return tickService.delete(id)
    }
}
