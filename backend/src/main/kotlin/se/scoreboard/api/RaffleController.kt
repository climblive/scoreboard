package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.data.domain.Raffle
import se.scoreboard.dto.RaffleDto
import se.scoreboard.dto.RaffleWinnerDto
import se.scoreboard.exception.WebException
import se.scoreboard.mapper.RaffleWinnerMapper
import se.scoreboard.service.RaffleService
import se.scoreboard.service.RaffleWinnerService
import java.time.OffsetDateTime
import javax.servlet.http.HttpServletRequest
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Raffle"])
class RaffleController @Autowired constructor(
        val raffleService: RaffleService,
        private var winnerMapper: RaffleWinnerMapper) {

    @GetMapping("/raffle/{id}")
    @PreAuthorize("hasPermission(#id, 'Raffle', 'read')")
    @Transactional
    fun getRaffle(@PathVariable("id") id: Int) = raffleService.findById(id)

    @GetMapping("/raffle/{id}/winner")
    @PreAuthorize("hasPermission(#id, 'Raffle', 'read')")
    @Transactional
    fun getRaffleWinners(@PathVariable("id") id: Int) : List<RaffleWinnerDto> =
            raffleService.fetchEntity(id).winners.map { winner -> winnerMapper.convertToDto(winner) }.sortedBy { winner -> winner.timestamp }

    @PostMapping("/raffle/{id}/winner")
    @PreAuthorize("hasPermission(#id, 'Raffle', 'write')")
    @Transactional
    fun drawWinner(@PathVariable("id") id: Int): ResponseEntity<RaffleWinnerDto> {
        val winner = raffleService.drawWinner(id)
        return ResponseEntity(winnerMapper.convertToDto(winner), HttpStatus.CREATED)
    }

    @PostMapping("/raffle")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_ORGANIZER')")
    @Transactional
    fun createRaffle(@RequestBody raffle : RaffleDto) = raffleService.create(raffle)

    @PutMapping("/raffle/{id}")
    @PreAuthorize("hasPermission(#id, 'Raffle', 'write')")
    @Transactional
    fun updateRaffle(
            @PathVariable("id") id: Int,
            @RequestBody raffle : RaffleDto) = raffleService.update(id, raffle)

    @DeleteMapping("/raffle/{id}")
    @PreAuthorize("hasPermission(#id, 'Raffle', 'delete')")
    @Transactional
    fun deleteRaffle(@PathVariable("id") id: Int) = raffleService.delete(id)
}
