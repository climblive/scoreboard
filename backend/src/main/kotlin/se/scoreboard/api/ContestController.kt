package se.scoreboard.api

import com.google.common.net.MediaType
import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.extension.getQualificationScore
import se.scoreboard.data.domain.extension.getTotalScore
import se.scoreboard.dto.*
import se.scoreboard.mapper.CompClassMapper
import se.scoreboard.mapper.ContenderMapper
import se.scoreboard.mapper.ProblemMapper
import se.scoreboard.service.ContestService

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

    private fun getContenderList(contenders: List<Contender>): List<ScoreboardListItemDto> {
        return contenders.map { ScoreboardListItemDto(it.id!!, it.name!!, it.getTotalScore(), it.getQualificationScore()) }
    }

    @GetMapping("/contest/{id}/scoreboard")
    fun getScoreboard(@PathVariable("id") id: Int) : List<ScoreboardListDto> {
        val contest = contestService.fetchEntity(id)
        val contenders = contest.contenders
        return contest.compClasses.sortedBy { it.id }.map{compClass -> ScoreboardListDto(compClassMapper.convertToDto(compClass), getContenderList(contenders.filter{it.compClass == compClass}))}
    }
}
