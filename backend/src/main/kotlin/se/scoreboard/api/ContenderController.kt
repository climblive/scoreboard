package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.data.domain.extension.getQualificationScore
import se.scoreboard.data.domain.extension.getTotalScore
import se.scoreboard.dto.ContenderDto
import se.scoreboard.dto.ScoreDto
import se.scoreboard.dto.ScoringDto
import se.scoreboard.dto.TickDto
import se.scoreboard.mapper.TickMapper
import se.scoreboard.service.ContenderService
import javax.servlet.http.HttpServletRequest
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Contender"])
class ContenderController @Autowired constructor(
        val contenderService: ContenderService,
        private var tickMapper: TickMapper) {

    @GetMapping("/contender")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getContenders(request: HttpServletRequest, @RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = contenderService.search(request, pageable)

    @GetMapping("/contender/{id}")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getContender(@PathVariable("id") id: Int) = contenderService.findById(id)

    @GetMapping("/contender/findByCode")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getContenderByCode(@RequestParam("code") code: String) = contenderService.findByCode(code)

    @GetMapping("/contender/{id}/tick")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getContenderTicks(@PathVariable("id") id: Int) : List<TickDto> {
        return contenderService.fetchEntity(id).ticks.map { tick -> tickMapper.convertToDto(tick) }
    }

    @GetMapping("/contender/{id}/score")
    @PostAuthorize("hasPermission(#id, 'ContenderDto', 'read')")
    @Transactional
    fun getContenderScore(@PathVariable("id") id: Int) : ScoreDto {
        val contender = contenderService.fetchEntity(id)
        return ScoreDto(contender.id!!, contender.getQualificationScore(), contender.getTotalScore())
    }

    @PostMapping("/contender")
    @PreAuthorize("hasPermission(#contender, 'create')")
    @Transactional
    fun createContender(@RequestBody contender : ContenderDto) = contenderService.create(contender)

    @PutMapping("/contender/{id}")
    @PreAuthorize("hasPermission(#id, 'ContenderDto', 'update') && hasPermission(#contender, 'update')")
    @Transactional
    fun updateContender(@PathVariable("id") id: Int,
                        @RequestBody contender : ContenderDto) = contenderService.update(id, contender)

    @DeleteMapping("/contender/{id}")
    @PreAuthorize("hasPermission(#id, 'ContenderDto', 'delete')")
    @Transactional
    fun deleteContender(@PathVariable("id") id: Int) = contenderService.delete(id)
}
