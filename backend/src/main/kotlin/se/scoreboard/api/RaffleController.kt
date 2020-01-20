package se.scoreboard.api

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.RaffleDto
import se.scoreboard.dto.RaffleWinnerDto
import se.scoreboard.exception.WebException
import se.scoreboard.mapper.RaffleWinnerMapper
import se.scoreboard.service.RaffleService
import se.scoreboard.service.RaffleWinnerService
import java.time.OffsetDateTime
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
class RaffleController @Autowired constructor(
        val raffleService: RaffleService,
        val raffleWinnerService: RaffleWinnerService,
        private var winnerMapper: RaffleWinnerMapper) {

    @GetMapping("/raffle")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getRaffles(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = raffleService.search(pageable)

    @GetMapping("/raffle/{id}")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getRaffle(@PathVariable("id") id: Int) = raffleService.findById(id)

    @GetMapping("/raffle/{id}/winner")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getRaffleWinners(@PathVariable("id") id: Int) : List<RaffleWinnerDto> =
            raffleService.fetchEntity(id).winners.map { winner -> winnerMapper.convertToDto(winner) }.sortedBy { winner -> winner.timestamp }

    @PostMapping("/raffle/{id}/winner")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun drawWinner(@PathVariable("id") id: Int) : ResponseEntity<RaffleWinnerDto> {
        val raffle = raffleService.fetchEntity(id)
        val winners = raffle.winners.map { winner -> winner.contender?.id }
        val contendersInTheDraw = raffle.contest?.contenders?.filter { contender -> contender.entered != null && !(contender.id in winners) }

        if (contendersInTheDraw != null && contendersInTheDraw.isNotEmpty()) {
            var winner: RaffleWinnerDto = RaffleWinnerDto(null, id, contendersInTheDraw.random().id!!, OffsetDateTime.now())
            return raffleWinnerService.create(winner)
        } else {
            throw WebException(HttpStatus.NOT_FOUND, "All winners have been drawn")
        }
    }

    @DeleteMapping("/raffle/{id}/winner/{raffleWinnerId}")
    @PreAuthorize("hasPermission(#id, 'RaffleDto', 'read') && hasPermission(#raffleWinnerId, 'RaffleWinnerDto', 'delete')")
    @Transactional
    fun deleteWinner(@PathVariable("id") id: Int, @PathVariable("raffleWinnerId") raffleWinnerId: Int) : ResponseEntity<RaffleWinnerDto> {
        raffleService.fetchEntity(id)
        return raffleWinnerService.delete(raffleWinnerId)
    }

    @PostMapping("/raffle")
    @PreAuthorize("hasPermission(#raffle, 'create')")
    @Transactional
    fun createRaffle(@RequestBody raffle : RaffleDto) = raffleService.create(raffle)

    @PutMapping("/raffle/{id}")
    @PreAuthorize("hasPermission(#id, 'RaffleDto', 'update') && hasPermission(#raffle, 'update')")
    @Transactional
    fun updateRaffle(
            @PathVariable("id") id: Int,
            @RequestBody raffle : RaffleDto) = raffleService.update(id, raffle)

    @DeleteMapping("/raffle/{id}")
    @PreAuthorize("hasPermission(#id, 'RaffleDto', 'delete')")
    @Transactional
    fun deleteRaffle(@PathVariable("id") id: Int) = raffleService.delete(id)
}
