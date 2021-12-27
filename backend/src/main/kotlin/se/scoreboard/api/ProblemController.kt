package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ProblemDto
import se.scoreboard.dto.TickDto
import se.scoreboard.mapper.ProblemMapper
import se.scoreboard.mapper.TickMapper
import se.scoreboard.service.ProblemService
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Problem"])
class ProblemController @Autowired constructor(
        val problemService: ProblemService,
        private var tickMapper: TickMapper,
        private val problemMapper: ProblemMapper) {

    @GetMapping("/problem/{id}")
    @PreAuthorize("hasPermission(#id, 'Problem', 'read')")
    @Transactional
    fun getProblem(@PathVariable("id") id: Int) = problemService.findById(id)

    @GetMapping("/problem/{id}/tick")
    @PreAuthorize("hasPermission(#id, 'Problem', 'read')")
    @Transactional
    fun getProblemTicks(@PathVariable("id") id: Int) : List<TickDto> =
            problemService.fetchEntity(id).ticks.map { tick -> tickMapper.convertToDto(tick) }

    @PutMapping("/problem/{id}")
    @PreAuthorize("hasPermission(#id, 'Problem', 'write')")
    @Transactional
    fun updateProblem(
            @PathVariable("id") id: Int,
            @RequestBody problem : ProblemDto): ResponseEntity<ProblemDto> {
        val old = problemService.fetchEntity(id)

        val entity = problemMapper.convertToEntity(problem)
        entity.contest = old.contest
        entity.organizer = old.organizer

        return problemService.update(id, entity)
    }

    @DeleteMapping("/problem/{id}")
    @PreAuthorize("hasPermission(#id, 'Problem', 'delete')")
    @Transactional
    fun deleteProblem(@PathVariable("id") id: Int) = problemService.delete(id)
}
