package se.scoreboard.api

import com.google.common.net.MediaType
import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.CompClassDto
import se.scoreboard.dto.ContenderDto
import se.scoreboard.dto.ContestDto
import se.scoreboard.dto.ProblemDto
import se.scoreboard.mapper.CompClassMapper
import se.scoreboard.mapper.ContenderMapper
import se.scoreboard.mapper.ProblemMapper
import se.scoreboard.service.ContestService
import java.util.*

@RestController
@CrossOrigin
@RequestMapping("/api")
class ContestController @Autowired constructor(
        private val contestService: ContestService) {

    private lateinit var problemMapper: ProblemMapper
    private lateinit var contenderMapper: ContenderMapper
    private lateinit var compClassMapper: CompClassMapper

    init {
        problemMapper = Mappers.getMapper(ProblemMapper::class.java)
        contenderMapper = Mappers.getMapper(ContenderMapper::class.java)
        compClassMapper = Mappers.getMapper(CompClassMapper::class.java)
    }

    @GetMapping("/contest")
    fun getContests(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = contestService.search(filter, pageable)

    @GetMapping("/contest/{id}")
    fun getContest(@PathVariable("id") id: Int) = contestService.findById(id)

    @GetMapping("/contest/{id}/problem")
    fun getContestProblems(@PathVariable("id") id: Int) : List<ProblemDto> =
            contestService.fetchEntity(id).problems.map { problem -> problemMapper.convertToDto(problem) }

    @GetMapping("/contest/{id}/contender")
    fun getContestContenders(@PathVariable("id") id: Int) : List<ContenderDto> =
            contestService.fetchEntity(id).contenders.map { contender -> contenderMapper.convertToDto(contender) }

    @GetMapping("/contest/{id}/compClass")
    fun getContestCompClasses(@PathVariable("id") id: Int) : List<CompClassDto> =
            contestService.fetchEntity(id).compClasses.map { compClass -> compClassMapper.convertToDto(compClass) }

    @PostMapping("/contest")
    fun createContest(@RequestBody contest : ContestDto) = contestService.create(contest)

    @PutMapping("/contest/{id}")
    fun updateContest(
            @PathVariable("id") id: Int,
            @RequestBody contest : ContestDto) = contestService.update(id, contest)

    @DeleteMapping("/contest/{id}")
    fun deleteContest(@PathVariable("id") id: Int) = contestService.delete(id)

    @GetMapping("/contest/export/{id}")
    fun export(@PathVariable("id") id: Int) : ResponseEntity<ByteArray> {
        val data = contestService.export(id)
        val headers = HttpHeaders()
        headers.set(HttpHeaders.CONTENT_TYPE, MediaType.MICROSOFT_EXCEL.toString())
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=contest.xls")
        return ResponseEntity(data, headers, HttpStatus.OK)
    }
}
