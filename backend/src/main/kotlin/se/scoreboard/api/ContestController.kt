package se.scoreboard.api

import com.google.common.net.MediaType
import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.extension.getQualificationScore
import se.scoreboard.data.domain.extension.getTotalScore
import se.scoreboard.data.repo.ContenderRepository
import se.scoreboard.data.repo.RaffleRepository
import se.scoreboard.data.repo.TickRepository
import se.scoreboard.dto.*
import se.scoreboard.dto.scoreboard.*
import se.scoreboard.exception.WebException
import se.scoreboard.mapper.*
import se.scoreboard.service.ContenderService
import se.scoreboard.service.ContestService
import java.time.OffsetDateTime
import javax.servlet.http.HttpServletRequest
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Contest"])
class ContestController @Autowired constructor(
        private val contestService: ContestService,
        private val contenderService: ContenderService,
        private val tickRepository: TickRepository,
        private var problemMapper: ProblemMapper,
        private var contenderMapper: ContenderMapper,
        private var compClassMapper: CompClassMapper,
        private var tickMapper: TickMapper,
        private var raffleMapper: RaffleMapper) {

    @GetMapping("/contest")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getContests(request: HttpServletRequest, @RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = contestService.search(request, pageable)

    @GetMapping("/contest/{id}")
    @PreAuthorize("true")
    @Transactional
    fun getContest(@PathVariable("id") id: Int) = contestService.findById(id)

    @GetMapping("/contest/{id}/problem")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getContestProblems(@PathVariable("id") id: Int) : List<ProblemDto> =
            contestService.fetchEntity(id).problems.map { problem -> problemMapper.convertToDto(problem) }

    @GetMapping("/contest/{id}/contender")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getContestContenders(@PathVariable("id") id: Int) : List<ContenderDto> =
            contestService.fetchEntity(id).contenders.map { contender -> contenderMapper.convertToDto(contender) }

    @GetMapping("/contest/{id}/compClass")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getContestCompClasses(@PathVariable("id") id: Int) : List<CompClassDto> =
            contestService.fetchEntity(id).compClasses.map { compClass -> compClassMapper.convertToDto(compClass) }

    @GetMapping("/contest/{id}/tick")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getContestTicks(@PathVariable("id") id: Int) : List<TickDto> =
            tickRepository.findAllByContestId(id).map { tickMapper.convertToDto(it) }

    @GetMapping("/contest/{id}/raffle")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getContestRaffles(@PathVariable("id") id: Int) : List<RaffleDto> =
            contestService.fetchEntity(id).raffles.map { raffleMapper.convertToDto(it) }

    @PostMapping("/contest")
    @PreAuthorize("hasPermission(#contest, 'create')")
    @Transactional
    fun createContest(@RequestBody contest : ContestDto) = contestService.create(contest)

    @PutMapping("/contest/{id}")
    @PreAuthorize("hasPermission(#id, 'ContestDto', 'update') && hasPermission(#contest, 'update')")
    @Transactional
    fun updateContest(
            @PathVariable("id") id: Int,
            @RequestBody contest : ContestDto) = contestService.update(id, contest)

    @DeleteMapping("/contest/{id}")
    @PreAuthorize("hasPermission(#id, 'ContestDto', 'delete')")
    @Transactional
    fun deleteContest(@PathVariable("id") id: Int) = contestService.delete(id)

    @GetMapping("/contest/export/{id}")
    @PreAuthorize("hasPermission(#id, 'ContestDto', 'execute')")
    @Transactional
    fun export(@PathVariable("id") id: Int) : ResponseEntity<ByteArray> {
        val data = contestService.export(id)
        val headers = HttpHeaders()
        headers.set(HttpHeaders.CONTENT_TYPE, MediaType.MICROSOFT_EXCEL.toString())
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=contest.xls")
        return ResponseEntity(data, headers, HttpStatus.OK)
    }

    @PostMapping(path = arrayOf("/contest/{id}/pdf"), consumes = arrayOf("application/pdf"))
    @PreAuthorize("hasPermission(#id, 'ContestDto', 'execute')")
    @Transactional
    fun createPdf(@PathVariable("id") id: Int, @RequestBody payload:ByteArray) : ResponseEntity<ByteArray> {
        val data = contestService.getPdf(id, payload)
        val headers = HttpHeaders()
        headers.set(HttpHeaders.CONTENT_TYPE, MediaType.PDF.toString())
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=contest.pdf")
        return ResponseEntity(data, headers, HttpStatus.OK)
    }

    @GetMapping(path = arrayOf("/contest/{id}/pdf"))
    @PreAuthorize("hasPermission(#id, 'ContestDto', 'execute')")
    @Transactional
    fun createPdf(@PathVariable("id") id: Int) : ResponseEntity<ByteArray> {
        val data = contestService.getPdf(id)
        val headers = HttpHeaders()
        headers.set(HttpHeaders.CONTENT_TYPE, MediaType.PDF.toString())
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=contest.pdf")
        return ResponseEntity(data, headers, HttpStatus.OK)
    }

    @GetMapping("/contest/{id}/scoreboard")
    @Transactional
    fun getScoreboard(@PathVariable("id") id: Int) = contestService.getScoreboard(id)

    @PutMapping("/contest/{id}/createContenders")
    @PreAuthorize("hasPermission(#id, 'ContestDto', 'execute')")
    @Transactional
    fun createContenders(
            @PathVariable("id") id: Int,
            @RequestBody createContendersParamsDto: CreateContendersParamsDto): Array<ContenderDto> {

        val contest= contestService.fetchEntity(id)
        return contenderService.createContenders(contest, createContendersParamsDto.count)
    }

    @GetMapping("/contest/{id}/resetContenders")
    @PreAuthorize("hasPermission(#id, 'ContestDto', 'execute')")
    @Transactional
    fun resetContenders(@PathVariable("id") id: Int) = contestService.resetContenders(id)
}
