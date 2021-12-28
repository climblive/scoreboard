package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.data.domain.extension.getQualificationScore
import se.scoreboard.data.domain.extension.getTotalScore
import se.scoreboard.dto.ContenderDto
import se.scoreboard.dto.ScoreDto
import se.scoreboard.dto.ScoringDto
import se.scoreboard.dto.TickDto
import se.scoreboard.mapper.ContenderMapper
import se.scoreboard.mapper.TickMapper
import se.scoreboard.service.ContenderService
import se.scoreboard.service.TickService
import javax.persistence.EntityManager
import javax.servlet.http.HttpServletRequest
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Contender"])
class ContenderController @Autowired constructor(
        val contenderService: ContenderService,
        val tickService: TickService,
        private var tickMapper: TickMapper,
        private var contenderMapper: ContenderMapper) {

    @GetMapping("/contender/{id}")
    @PreAuthorize("hasPermission(#id, 'Contender', 'read')")
    @Transactional
    fun getContender(@PathVariable("id") id: Int) = contenderService.findById(id)

    @GetMapping("/contender/findByCode")
    @Transactional
    fun getContenderByCode(@RequestParam("code") code: String) = contenderService.findByCode(code)

    @GetMapping("/contender/{id}/tick")
    @PreAuthorize("hasPermission(#id, 'Contender', 'read')")
    @Transactional
    fun getContenderTicks(@PathVariable("id") id: Int) : List<TickDto> {
        return contenderService.fetchEntity(id).ticks.map { tick -> tickMapper.convertToDto(tick) }
    }

    @PostMapping("/contender/{id}/tick")
    @PreAuthorize("hasPermission(#id, 'Contender', 'write')")
    @Transactional
    fun createTick(@PathVariable("id") id: Int, @RequestBody tick : TickDto): ResponseEntity<TickDto> {
        val contender = contenderService.fetchEntity(id)

        val entity = tickMapper.convertToEntity(tick)
        entity.contender = contender
        entity.organizer = contender.organizer
        entity.contest = contender.contest

        contender.ticks.add(entity)

        return tickService.create(entity)
    }

    @GetMapping("/contender/{id}/score")
    @PreAuthorize("hasPermission(#id, 'Contender', 'read')")
    @Transactional
    fun getContenderScore(@PathVariable("id") id: Int) : ScoreDto {
        val contender = contenderService.fetchEntity(id)
        return ScoreDto(id, contender.getQualificationScore(), contender.getTotalScore())
    }

    @PutMapping("/contender/{id}")
    @PreAuthorize("hasPermission(#id, 'Contender', 'write')")
    @Transactional
    fun updateContender(@PathVariable("id") id: Int,
                        @RequestBody contender: ContenderDto): ResponseEntity<ContenderDto> {
        val old = contenderService.fetchEntity(id)

        val entity = contenderMapper.convertToEntity(contender)
        entity.organizer = old.organizer
        entity.contest = old.contest

        return contenderService.update(id, entity)
    }

    @DeleteMapping("/contender/{id}")
    @PreAuthorize("hasPermission(#id, 'Contender', 'delete')")
    @Transactional
    fun deleteContender(@PathVariable("id") id: Int) = contenderService.delete(id)
}
