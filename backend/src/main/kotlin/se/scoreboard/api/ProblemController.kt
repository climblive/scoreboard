package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ProblemDto
import se.scoreboard.dto.TickDto
import se.scoreboard.mapper.TickMapper
import se.scoreboard.service.ProblemService
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Problem"])
class ProblemController @Autowired constructor(
        val problemService: ProblemService,
        private var tickMapper: TickMapper) {

    @GetMapping("/problem")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getProblems(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = problemService.search(pageable)

    @GetMapping("/problem/{id}")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getProblem(@PathVariable("id") id: Int) = problemService.findById(id)

    @GetMapping("/problem/{id}/tick")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getProblemTicks(@PathVariable("id") id: Int) : List<TickDto> =
            problemService.fetchEntity(id).ticks.map { tick -> tickMapper.convertToDto(tick) }

    @PostMapping("/problem")
    @PreAuthorize("hasPermission(#problem, 'create')")
    @Transactional
    fun createProblem(@RequestBody problem : ProblemDto) = problemService.create(problem)

    @PutMapping("/problem/{id}")
    @PreAuthorize("hasPermission(#id, 'ProblemDto', 'update') && hasPermission(#problem, 'update')")
    @Transactional
    fun updateProblem(
            @PathVariable("id") id: Int,
            @RequestBody problem : ProblemDto) = problemService.update(id, problem)

    @DeleteMapping("/problem/{id}")
    @PreAuthorize("hasPermission(#id, 'ProblemDto', 'delete')")
    @Transactional
    fun deleteProblem(@PathVariable("id") id: Int) = problemService.delete(id)
}
