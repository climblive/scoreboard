package se.scoreboard.service

import org.apache.poi.hssf.usermodel.HSSFWorkbook
import org.apache.poi.ss.usermodel.Sheet
import org.apache.poi.ss.usermodel.Workbook
import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.domain.Location
import se.scoreboard.data.domain.Organizer
import se.scoreboard.data.domain.extension.getTotalScore
import se.scoreboard.data.repo.ContestRepository
import se.scoreboard.dto.ContestDto
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.mapper.ContestMapper
import java.io.ByteArrayOutputStream

@Service
class ContestService @Autowired constructor(
        contestRepository: ContestRepository,
        val pdfService: PdfService) : AbstractDataService<Contest, ContestDto, Int>(
        contestRepository) {

    override lateinit var entityMapper: AbstractMapper<Contest, ContestDto>

    init {
        entityMapper = Mappers.getMapper(ContestMapper::class.java)
    }

    override fun handleNested(entity: Contest, dto: ContestDto) {
        entity.location = entityManager.getReference(Location::class.java, dto.locationId)
        entity.organizer = entityManager.getReference(Organizer::class.java, dto.organizerId)
    }

    fun getPdf(id:Int, pdfTemplate:ByteArray) : ByteArray {
        val codes  = this.fetchEntity(id).contenders.map { it.registrationCode!! }
        return pdfService.createPdf(pdfTemplate, codes)
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
                    .sortedBy { it.getTotalScore() }
                    .reversed().
                            forEach{ contender ->
                                val score = contender.getTotalScore()
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
}