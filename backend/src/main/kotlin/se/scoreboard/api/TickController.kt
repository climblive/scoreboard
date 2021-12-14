package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.extension.allowedToAlterTick
import se.scoreboard.dto.TickDto
import se.scoreboard.exception.WebException
import se.scoreboard.mapper.TickMapper
import se.scoreboard.service.BroadcastService
import se.scoreboard.service.ContenderService
import se.scoreboard.service.TickService
import javax.servlet.http.HttpServletRequest
import javax.transaction.Transactional

@RestController
@CrossOrigin
@Transactional
@RequestMapping("/api")
@Api(tags = ["Tick"])
class TickController @Autowired constructor(
        val tickService: TickService,
        val tickMapper: TickMapper) {

    @GetMapping("/tick/{id}")
    @PreAuthorize("hasPermission(#id, 'Tick', 'read')")
    @Transactional
    fun getTick(@PathVariable("id") id: Int) = tickService.findById(id)

    @PutMapping("/tick/{id}")
    @PreAuthorize("hasPermission(#id, 'Tick', 'write')")
    @Transactional
    fun updateTick(
            @PathVariable("id") id: Int,
            @RequestBody tick : TickDto) = tickService.update(id, tickMapper.convertToEntity(tick))

    @DeleteMapping("/tick/{id}")
    @PreAuthorize("hasPermission(#id, 'Tick', 'delete')")
    @Transactional
    fun deleteTick(@PathVariable("id") id: Int) = tickService.delete(id)
}
