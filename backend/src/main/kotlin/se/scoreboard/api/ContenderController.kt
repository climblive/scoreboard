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
import se.scoreboard.mapper.ContenderMapper
import se.scoreboard.mapper.TickMapper
import se.scoreboard.service.ContenderService
import se.scoreboard.service.TickService
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
    fun createTick(@RequestBody tick : TickDto) = tickService.create(tickMapper.convertToEntity(tick))

 //   @GetMapping("/contender/{id}/problem")
 //   @PreAuthorize("hasPermission(#id, 'Contender', 'read')")
 //   @Transactional
 //   fun getContenderProblems(@PathVariable("id") id: Int) : List<TickDto> {
 //       return contenderService.fetchEntity(id).ticks.map { tick -> tickMapper.convertToDto(tick) }
 //   }

 //   @GetMapping("/contender/{id}/compClass")
 //   @PreAuthorize("hasPermission(#id, 'Contender', 'read')")
 //   @Transactional
 //   fun getContenderCompClasses(@PathVariable("id") id: Int) : List<TickDto> {
 //       return contenderService.fetchEntity(id).ticks.map { tick -> tickMapper.convertToDto(tick) }
 //   }

    @GetMapping("/contender/{id}/score")
    @PreAuthorize("hasPermission(#id, 'Contender', 'read')")
    @Transactional
    fun getContenderScore(@PathVariable("id") id: Int) : ScoreDto {
        val contender = contenderService.fetchEntity(id)
        return ScoreDto(contender.id!!, contender.getQualificationScore(), contender.getTotalScore())
    }

    @PostMapping("/contender")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_ORGANIZER')")
    @Transactional
    fun createContender(@RequestBody contender : ContenderDto) = contenderService.create(contenderMapper.convertToEntity(contender))

    @PutMapping("/contender/{id}")
    @PreAuthorize("hasPermission(#id, 'Contender', 'write')")
    @Transactional
    fun updateContender(@PathVariable("id") id: Int,
                        @RequestBody contender : ContenderDto) = contenderService.update(id, contenderMapper.convertToEntity(contender))

    @DeleteMapping("/contender/{id}")
    @PreAuthorize("hasPermission(#id, 'Contender', 'delete')")
    @Transactional
    fun deleteContender(@PathVariable("id") id: Int) = contenderService.delete(id)
}
