package se.scoreboard.api

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.web.bind.annotation.*
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.extension.getQualificationScore
import se.scoreboard.data.domain.extension.getTotalScore
import se.scoreboard.data.domain.extension.isInProgress
import se.scoreboard.dto.ScoreboardListItemDto
import se.scoreboard.dto.ScoreboardPushItemDto
import se.scoreboard.dto.TickDto
import se.scoreboard.exception.WebException
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
        private val simpMessagingTemplate : SimpMessagingTemplate?) {

    private fun broadcast(contender: Contender) {
        if (simpMessagingTemplate != null) {
            val scoreboardListItemDTO = ScoreboardListItemDto(
                    contender.id!!,
                    contender.name!!,
                    contender.getTotalScore(),
                    contender.getQualificationScore())
            val scoreboardPushItemDTO = ScoreboardPushItemDto(contender.compClass!!.id!!, scoreboardListItemDTO)
            simpMessagingTemplate.convertAndSend("/topic/scoreboard/" + contender.contest!!.id, scoreboardPushItemDTO)
        }
    }

    @GetMapping("/tick")
    fun getTicks(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = tickService.search(filter, pageable)

    @GetMapping("/tick/{id}")
    fun getTick(@PathVariable("id") id: Int) = tickService.findById(id)

    @PostMapping("/tick")
    fun createTick(@RequestBody tick : TickDto): TickDto {
        val contender = contenderService.fetchEntity(tick.contenderId!!)
        if(!contender.compClass!!.isInProgress()) {
            throw WebException(HttpStatus.FORBIDDEN, "The competition is not in progress");
        }

        val newTick = tickService.create(tick)
        broadcast(contender)
        return newTick
    }

    @PutMapping("/tick/{id}")
    fun updateTick(
            @PathVariable("id") id: Int,
            @RequestBody tick : TickDto): TickDto {
        val contender = contenderService.fetchEntity(tick.contenderId!!)
        if(!contender.compClass!!.isInProgress()) {
            throw WebException(HttpStatus.FORBIDDEN, "The competition is not in progress");
        }
        val newTick =tickService.update(id, tick)
        broadcast(contender)
        return newTick
    }

    @DeleteMapping("/tick/{id}")
    fun deleteTick(@PathVariable("id") id: Int) {
        var tick = tickService.fetchEntity(id)
        val contender = tick.contender
        if(!contender!!.compClass!!.isInProgress()) {
            throw WebException(HttpStatus.FORBIDDEN, "The competition is not in progress");
        }
        tickService.delete(id)
        broadcast(contender!!)
    }
}
