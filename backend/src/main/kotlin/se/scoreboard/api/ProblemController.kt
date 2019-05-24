package se.scoreboard.api

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ProblemDto
import se.scoreboard.dto.TickDto
import se.scoreboard.mapper.TickMapper
import se.scoreboard.service.ProblemService
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
class ProblemController @Autowired constructor(
        val problemService: ProblemService) {

    private lateinit var tickMapper: TickMapper

    init {
        tickMapper = Mappers.getMapper(TickMapper::class.java)
    }

    @GetMapping("/problem")
    @Transactional
    fun getProblems(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = problemService.search(filter, pageable)

    @GetMapping("/problem/{id}")
    @Transactional
    fun getProblem(@PathVariable("id") id: Int) = problemService.findById(id)

    @GetMapping("/problem/{id}/tick")
    @Transactional
    fun getProblemTicks(@PathVariable("id") id: Int) : List<TickDto> =
            problemService.fetchEntity(id).ticks.map { tick -> tickMapper.convertToDto(tick) }

    @PostMapping("/problem")
    @Transactional
    fun createProblem(@RequestBody problem : ProblemDto) = problemService.create(problem)

    @PutMapping("/problem/{id}")
    @Transactional
    fun updateProblem(
            @PathVariable("id") id: Int,
            @RequestBody problem : ProblemDto) = problemService.update(id, problem)

    @DeleteMapping("/problem/{id}")
    @Transactional
    fun deleteProblem(@PathVariable("id") id: Int) = problemService.delete(id)
}
