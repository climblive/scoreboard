package se.scoreboard.api

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.extension.*
import se.scoreboard.dto.ScoreboardListItemDto
import se.scoreboard.dto.ScoreboardPushItemDto
import se.scoreboard.dto.TickDto
import se.scoreboard.exception.WebException
import se.scoreboard.service.BroadcastService
import se.scoreboard.service.ContenderService
import se.scoreboard.service.TickService
import javax.transaction.Transactional

@RestController
@CrossOrigin
@Transactional
@RequestMapping("/api")
class TickController @Autowired constructor(
        val tickService: TickService,
        val contenderService: ContenderService,
        val broadcastService : BroadcastService) {

    @GetMapping("/tick")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getTicks(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = tickService.search(pageable)

    @GetMapping("/tick/{id}")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getTick(@PathVariable("id") id: Int) = tickService.findById(id)

    @PostMapping("/tick")
    @PreAuthorize("hasPermission(#tick, 'create')")
    @Transactional
    fun createTick(@RequestBody tick : TickDto): TickDto {
        val contender = contenderService.fetchEntity(tick.contenderId!!)
        if(!contender.compClass!!.allowedToAlterTick()) {
            throw WebException(HttpStatus.FORBIDDEN, "The competition is not in progress")
        }

        val newTick = tickService.create(tick)
        broadcastService.broadcast(contender)
        return newTick
    }

    @PutMapping("/tick/{id}")
    @PreAuthorize("hasPermission(#id, 'TickDto', 'update') && hasPermission(#tick, 'update')")
    @Transactional
    fun updateTick(
            @PathVariable("id") id: Int,
            @RequestBody tick : TickDto): TickDto {
        val contender = contenderService.fetchEntity(tick.contenderId!!)
        if(!contender.compClass!!.allowedToAlterTick()) {
            throw WebException(HttpStatus.FORBIDDEN, "The competition is not in progress")
        }
        val newTick =tickService.update(id, tick)
        broadcastService.broadcast(contender)
        return newTick
    }

    @DeleteMapping("/tick/{id}")
    @PreAuthorize("hasPermission(#id, 'TickDto', 'delete')")
    @Transactional
    fun deleteTick(@PathVariable("id") id: Int) {
        var tick = tickService.fetchEntity(id)
        val contender = tick.contender!!
        if(!contender.compClass!!.allowedToAlterTick()) {
            throw WebException(HttpStatus.FORBIDDEN, "The competition is not in progress")
        }
        tickService.delete(id)
        contender.ticks.remove(tick)
        broadcastService.broadcast(contender)
    }
}
