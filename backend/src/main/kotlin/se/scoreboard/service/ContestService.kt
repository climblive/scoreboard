package se.scoreboard.service

import org.apache.poi.hssf.usermodel.HSSFWorkbook
import org.apache.poi.ss.usermodel.Sheet
import org.apache.poi.ss.usermodel.Workbook
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.domain.extension.getTotalScore
import se.scoreboard.data.repo.ContestRepository
import se.scoreboard.dto.ContestDto
import se.scoreboard.mapper.AbstractMapper
import java.io.ByteArrayOutputStream

@Service
class ContestService @Autowired constructor(
        contestRepository: ContestRepository,
        val pdfService: PdfService,
        override var entityMapper: AbstractMapper<Contest, ContestDto>) : AbstractDataService<Contest, ContestDto, Int>(
        contestRepository) {

    var logger = LoggerFactory.getLogger(ContestService::class.java)

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