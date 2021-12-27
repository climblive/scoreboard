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
import se.scoreboard.mapper.RaffleMapper
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
        private var winnerMapper: RaffleWinnerMapper,
        private val raffleMapper: RaffleMapper) {

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
        val raffle = raffleService.fetchEntity(id)

        val winner = raffleService.drawWinner(raffle)
        return ResponseEntity(winnerMapper.convertToDto(winner), HttpStatus.CREATED)
    }

    @PutMapping("/raffle/{id}")
    @PreAuthorize("hasPermission(#id, 'Raffle', 'write')")
    @Transactional
    fun updateRaffle(
            @PathVariable("id") id: Int,
            @RequestBody raffle : RaffleDto): ResponseEntity<RaffleDto> {
        val old = raffleService.fetchEntity(id)

        val entity = raffleMapper.convertToEntity(raffle)
        entity.contest = old.contest
        entity.organizer = old.organizer

        return raffleService.update(id, entity)
    }

    @DeleteMapping("/raffle/{id}")
    @PreAuthorize("hasPermission(#id, 'Raffle', 'delete')")
    @Transactional
    fun deleteRaffle(@PathVariable("id") id: Int) = raffleService.delete(id)
}
