package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.RaffleDto
import se.scoreboard.dto.RaffleWinnerDto
import se.scoreboard.mapper.RaffleMapper
import se.scoreboard.mapper.RaffleWinnerMapper
import se.scoreboard.service.RaffleService
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Raffles"])
class RaffleController @Autowired constructor(
        val raffleService: RaffleService,
        private var winnerMapper: RaffleWinnerMapper,
        private val raffleMapper: RaffleMapper) {

    @GetMapping("/raffles/{id}")
    @PreAuthorize("hasPermission(#id, 'Raffle', 'read')")
    @Transactional
    fun getRaffle(@PathVariable("id") id: Int) = raffleService.findById(id)

    @GetMapping("/raffles/{id}/winners")
    @PreAuthorize("hasPermission(#id, 'Raffle', 'read')")
    @Transactional
    fun getRaffleWinners(@PathVariable("id") id: Int) : List<RaffleWinnerDto> =
            raffleService.fetchEntity(id).winners.map { winner -> winnerMapper.convertToDto(winner) }.sortedBy { winner -> winner.timestamp }

    @PostMapping("/raffles/{id}/winners")
    @PreAuthorize("hasPermission(#id, 'Raffle', 'write')")
    @Transactional
    fun drawWinner(@PathVariable("id") id: Int): ResponseEntity<RaffleWinnerDto> {
        val raffle = raffleService.fetchEntity(id)

        val winner = raffleService.drawWinner(raffle)
        return ResponseEntity(winnerMapper.convertToDto(winner), HttpStatus.CREATED)
    }

    @PutMapping("/raffles/{id}")
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

    @DeleteMapping("/raffles/{id}")
    @PreAuthorize("hasPermission(#id, 'Raffle', 'delete')")
    @Transactional
    fun deleteRaffle(@PathVariable("id") id: Int) = raffleService.delete(id)
}
