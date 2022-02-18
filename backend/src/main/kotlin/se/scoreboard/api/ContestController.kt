package se.scoreboard.api

import com.google.common.net.MediaType
import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.data.repo.TickRepository
import se.scoreboard.dto.*
import se.scoreboard.mapper.*
import se.scoreboard.service.*
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Contests"])
class ContestController @Autowired constructor(
        private val contestService: ContestService,
        private val contenderService: ContenderService,
        private val tickRepository: TickRepository,
        private var problemMapper: ProblemMapper,
        private var contenderMapper: ContenderMapper,
        private val contestMapper: ContestMapper,
        private var compClassMapper: CompClassMapper,
        private var tickMapper: TickMapper,
        private var raffleMapper: RaffleMapper,
        private val compClassService: CompClassService,
        private val problemService: ProblemService,
        private val raffleService: RaffleService) {

    @GetMapping("/contests/{id}")
    @PreAuthorize("true")
    @Transactional
    fun getContest(@PathVariable("id") id: Int) = contestService.findById(id)

    @GetMapping("/contests/{id}/problems")
    @PreAuthorize("hasPermission(#id, 'Contest', 'read')")
    @Transactional
    fun getContestProblems(@PathVariable("id") id: Int) : List<ProblemDto> =
        problemService.getProblems(id)

    @PostMapping("/contests/{id}/problems")
    @PreAuthorize("hasPermission(#id, 'Contest', 'write')")
    @Transactional
    fun createProblem(@PathVariable("id") id: Int, @RequestBody problem : ProblemDto): ResponseEntity<ProblemDto> {
        val contest = contestService.fetchEntity(id)

        val entity = problemMapper.convertToEntity(problem)
        entity.organizer = contest.organizer
        entity.contest = contest

        return problemService.create(entity)
    }

    @GetMapping("/contests/{id}/contenders")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ORGANIZER') && hasPermission(#id, 'Contest', 'read')")
    @Transactional
    fun getContestContenders(@PathVariable("id") id: Int) : List<ContenderDto> =
            contestService.fetchEntity(id).contenders.map { contender -> contenderMapper.convertToDto(contender) }

    @GetMapping("/contests/{id}/compClasses")
    @PreAuthorize("hasPermission(#id, 'Contest', 'read')")
    @Transactional
    fun getContestCompClasses(@PathVariable("id") id: Int) : List<CompClassDto> =
            contestService.fetchEntity(id).compClasses.map { compClass -> compClassMapper.convertToDto(compClass) }

    @PostMapping("/contests/{id}/compClasses")
    @PreAuthorize("hasPermission(#id, 'Contest', 'write')")
    @Transactional
    fun createCompClass(@PathVariable("id") id: Int, @RequestBody compClass : CompClassDto): ResponseEntity<CompClassDto> {
        val contest = contestService.fetchEntity(id)

        val entity = compClassMapper.convertToEntity(compClass)
        entity.contest = contest
        entity.organizer = contest.organizer

        return compClassService.create(entity)
    }

    @GetMapping("/contests/{id}/ticks")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ORGANIZER') && hasPermission(#id, 'Contest', 'read')")
    @Transactional
    fun getContestTicks(@PathVariable("id") id: Int) : List<TickDto> =
            tickRepository.findAllByContestId(id).map { tickMapper.convertToDto(it) }

    @GetMapping("/contests/{id}/raffles")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ORGANIZER') && hasPermission(#id, 'Contest', 'read')")
    @Transactional
    fun getContestRaffles(@PathVariable("id") id: Int) : List<RaffleDto> =
            contestService.fetchEntity(id).raffles.map { raffleMapper.convertToDto(it) }

    @PostMapping("/contests/{id}/raffles")
    @PreAuthorize("hasPermission(#id, 'Contest', 'write')")
    @Transactional
    fun createRaffle(@PathVariable("id") id: Int, @RequestBody raffle : RaffleDto): ResponseEntity<RaffleDto> {
        val contest = contestService.fetchEntity(id)

        val entity = raffleMapper.convertToEntity(raffle)
        entity.organizer = contest.organizer
        entity.contest = contest

        return raffleService.create(entity)
    }

    @PutMapping("/contests/{id}")
    @PreAuthorize("hasPermission(#id, 'Contest', 'write')")
    @Transactional
    fun updateContest(
            @PathVariable("id") id: Int,
            @RequestBody contest : ContestDto): ResponseEntity<ContestDto> {
        val old = contestService.fetchEntity(id)

        val entity = contestMapper.convertToEntity(contest)
        entity.organizer = old.organizer

        return contestService.update(id, entity)
    }

    @DeleteMapping("/contests/{id}")
    @PreAuthorize("hasPermission(#id, 'Contest', 'delete')")
    @Transactional
    fun deleteContest(@PathVariable("id") id: Int) = contestService.delete(id)

    @GetMapping("/contests/{id}/export")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ORGANIZER') && hasPermission(#id, 'Contest', 'read')")
    @Transactional
    fun export(@PathVariable("id") id: Int) : ResponseEntity<ByteArray> {
        val data = contestService.export(id)
        val headers = HttpHeaders()
        headers.set(HttpHeaders.CONTENT_TYPE, MediaType.MICROSOFT_EXCEL.toString())
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=contest.xls")
        return ResponseEntity(data, headers, HttpStatus.OK)
    }

    @PostMapping(path = arrayOf("/contests/{id}/pdf"), consumes = arrayOf("application/pdf"))
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ORGANIZER') && hasPermission(#id, 'Contest', 'read')")
    @Transactional
    fun createPdf(@PathVariable("id") id: Int, @RequestBody payload:ByteArray) : ResponseEntity<ByteArray> {
        val data = contestService.getPdf(id, payload)
        val headers = HttpHeaders()
        headers.set(HttpHeaders.CONTENT_TYPE, MediaType.PDF.toString())
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=contest.pdf")
        return ResponseEntity(data, headers, HttpStatus.OK)
    }

    @GetMapping(path = arrayOf("/contests/{id}/pdf"))
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ORGANIZER') && hasPermission(#id, 'Contest', 'read')")
    @Transactional
    fun createPdf(@PathVariable("id") id: Int) : ResponseEntity<ByteArray> {
        val data = contestService.getPdf(id)
        val headers = HttpHeaders()
        headers.set(HttpHeaders.CONTENT_TYPE, MediaType.PDF.toString())
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=contest.pdf")
        return ResponseEntity(data, headers, HttpStatus.OK)
    }

    @GetMapping("/contests/{id}/scoreboard")
    @Transactional
    @PreAuthorize("true")
    fun getScoreboard(@PathVariable("id") id: Int) = contestService.getScoreboard(id)

    @PutMapping("/contests/{id}/createContenders")
    @PreAuthorize("hasPermission(#id, 'Contest', 'write')")
    @Transactional
    fun createContenders(
            @PathVariable("id") id: Int,
            @RequestBody createContendersParamsDto: CreateContendersParamsDto): Array<ContenderDto> {

        val contest = contestService.fetchEntity(id)
        return contenderService.createContenders(contest, createContendersParamsDto.count)
    }

    @PostMapping("/contests/{id}/copy")
    @PreAuthorize("hasPermission(#id, 'Contest', 'write')")
    @Transactional
    fun copyContest(@PathVariable("id") id: Int) = contestService.copy(id)
}
