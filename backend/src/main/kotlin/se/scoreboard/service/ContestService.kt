package se.scoreboard.service

import org.apache.poi.hssf.usermodel.HSSFWorkbook
import org.apache.poi.ss.usermodel.Sheet
import org.apache.poi.ss.usermodel.Workbook
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import se.scoreboard.SlackNotifier
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.domain.extension.getQualificationScore
import se.scoreboard.data.domain.extension.getTotalScore
import se.scoreboard.data.repo.*
import se.scoreboard.dto.*
import se.scoreboard.dto.scoreboard.RaffleWinnerPushItemDto
import se.scoreboard.exception.WebException
import se.scoreboard.getUserPrincipal
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.mapper.CompClassMapper
import se.scoreboard.mapper.RaffleMapper
import java.io.ByteArrayOutputStream
import java.time.OffsetDateTime
import java.time.ZoneOffset

@Service
class ContestService @Autowired constructor(
        contestRepository: ContestRepository,
        private val contenderRepository: ContenderRepository,
        private val tickRepository: TickRepository,
        private val raffleRepository: RaffleRepository,
        private val raffleWinnerRepository: RaffleWinnerRepository,
        private val compClassRepository: CompClassRepository,
        private val problemRepository: ProblemRepository,
        private val pdfService: PdfService,
        private val slackNotifier: SlackNotifier,
        private var raffleMapper: RaffleMapper,
        private var compClassMapper: CompClassMapper,
        override var entityMapper: AbstractMapper<Contest, ContestDto>) : AbstractDataService<Contest, ContestDto, Int>(
        contestRepository) {

    init {
        addConstraints(ContestDto::protected.name, ContestDto::protected, "ROLE_ORGANIZER", AttributeConstraintType.IMMUTABLE)
    }

    override fun onCreate(phase: Phase, new: Contest) {
        when (phase) {
            Phase.AFTER -> slackNotifier.newContest(new, getUserPrincipal())
            else -> {}
        }
    }

    override fun onDelete(phase: Phase, old: Contest) {
        when (phase) {
            Phase.BEFORE -> {
                if (old.isProtected) {
                    throw WebException(HttpStatus.CONFLICT, "Cannot delete protected contest")
                }

                old.raffles.forEach { raffleWinnerRepository.deleteAll(it.winners) }
                raffleRepository.deleteAll(old.raffles)

                old.contenders.forEach { tickRepository.deleteAll(it.ticks) }
                contenderRepository.deleteAll(old.contenders)

                compClassRepository.deleteAll(old.compClasses)

                problemRepository.deleteAll(old.problems)
            }
            else -> {}
        }
    }

    fun getPdf(id:Int, pdfTemplate:ByteArray) : ByteArray {
        val codes = fetchEntity(id).contenders.sortedBy { it.id }.map { it.registrationCode!! }
        return pdfService.createPdf(pdfTemplate, codes)
    }

    fun getPdf(id:Int) : ByteArray {
        val codes = fetchEntity(id).contenders.sortedBy { it.id }.map { it.registrationCode!! }
        return pdfService.createPdf(codes)
    }

    fun export(id: Int): ByteArray {
        val workbook: Workbook = HSSFWorkbook()
        val contest: Contest = fetchEntity(id)
        val allContenders = contest.contenders
        contest.compClasses.forEach{ compClass ->
            val sheet: Sheet = workbook.createSheet(compClass.name)

            val headerRow = sheet.createRow(0)
            headerRow.createCell(1).setCellValue("Name")
            headerRow.createCell(2).setCellValue("Score")

            var rowNum = 1
            var lastScore = -10
            var lastPosition:Number = -1
            allContenders
                    .filter { it.compClass?.name == compClass.name }
                    .sortedBy { it.getQualificationScore() }
                    .reversed().
                            forEach{ contender ->
                                val score = contender.getQualificationScore()
                                if(score != lastScore) {
                                    lastPosition = rowNum
                                    lastScore = score
                                }
                                val row = sheet.createRow(rowNum++)
                                row.createCell(0).setCellValue(lastPosition.toDouble())
                                row.createCell(1).setCellValue(contender.name)
                                row.createCell(2).setCellValue(score.toDouble())
                            }
        }

        val baos = ByteArrayOutputStream()
        workbook.write(baos)
        val data = baos.toByteArray()
        baos.close()
        workbook.close()
        return data
    }

    private fun getContenderList(contenders: List<Contender>): List<ScoreboardListItemDto> {
        return contenders.map { ScoreboardListItemDto(it.id!!, it.name!!, it.getTotalScore(), it.getQualificationScore()) }
    }

    fun getScoreboard(id: Int) : ResponseEntity<ScoreboardDto> {
        val contest = fetchEntity(id)
        val contenders = contest.contenders
        val raffle: RaffleWinnerListDto? = contest.raffles.firstOrNull { it.isActive }?.let { raffle ->
            val winners = raffle.winners.
                    map { winner -> RaffleWinnerPushItemDto(
                            raffle.id!!,
                            winner.contender?.id!!,
                            winner.contender?.name!!,
                            winner.timestamp!!) }
                    .sortedBy { winner -> winner.timestamp }
            RaffleWinnerListDto(raffleMapper.convertToDto(raffle), winners)
        }
        val scoreboard = ScoreboardDto(
                id,
                raffle,
                contest.compClasses
                        .sortedBy { it.id }
                        .map { compClass -> ScoreboardListDto(
                                compClassMapper.convertToDto(compClass),
                                getContenderList(contenders.filter { it.compClass == compClass }))
                        })

        return ResponseEntity.ok(scoreboard)
    }
}
