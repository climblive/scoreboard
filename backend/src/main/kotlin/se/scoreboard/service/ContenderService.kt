package se.scoreboard.service

import com.google.gson.*
import org.apache.poi.hssf.usermodel.HSSFWorkbook
import org.apache.poi.ss.usermodel.Sheet
import org.apache.poi.ss.usermodel.Workbook
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import se.scoreboard.dto.ScoreboardListItemDTO
import se.scoreboard.dto.ScoreboardPushItemDTO
import se.scoreboard.model.ContenderData
import se.scoreboard.model.Contest
import se.scoreboard.model.Problem
import se.scoreboard.storage.DataStorage
import se.scoreboard.storage.FileDataStorage
import java.io.ByteArrayOutputStream
import java.time.ZonedDateTime
import java.io.FileOutputStream




@Service
class ContenderService @Autowired constructor(private val dataStorage: DataStorage, private val simpMessagingTemplate : SimpMessagingTemplate?) {

    fun getContest(): Contest {

        val gson = GsonBuilder().registerTypeAdapter(ZonedDateTime::class.java, JsonDeserializer<ZonedDateTime> { json, type, jsonDeserializationContext -> ZonedDateTime.parse(json.asJsonPrimitive.asString) }).create()
        val fileContent = FileDataStorage::class.java.getResource("/contest.json").readText()
        return gson.fromJson(fileContent, Contest::class.java)
    }

    fun getProblems() :List<Problem> = getContest().problems

    fun getContenderData(code: String) : ContenderData? = dataStorage.getContenderData(code)

    fun setContenderData(data : ContenderData) {
        dataStorage.setContenderData(data)
        
        if(simpMessagingTemplate != null) {
            var contenderData = dataStorage.getContenderData(data.code)!!
            val contest = getContest()
            val scoreboardListItemDTO = ScoreboardListItemDTO(contenderData.id, contenderData.name, contenderData.getScore(contest), contenderData.getTenBestScore(contest))
            val scoreboardPushItemDTO = ScoreboardPushItemDTO(contenderData.compClass, scoreboardListItemDTO);
            simpMessagingTemplate.convertAndSend("/topic/scoreboard", scoreboardPushItemDTO)
        }
    }

    fun getAllContenders() = dataStorage.getAllContenders()

    fun export(): ByteArray {
        val workbook: Workbook = HSSFWorkbook()
        val contest: Contest = getContest()
        val allContenders = dataStorage.getAllContenders()
        contest.compClasses.forEach{compClass ->
            val sheet: Sheet = workbook.createSheet(compClass.name)

            val headerRow = sheet.createRow(0)
            headerRow.createCell(1).setCellValue("Name")
            headerRow.createCell(2).setCellValue("Score")

            var rowNum = 1
            var lastScore = -10
            var lastPosition:Number = -1
            allContenders
                    .filter { it.compClass == compClass.name }
                    .sortedBy { it.getScore(contest) }
                    .reversed().
            forEach{ contender ->
                val score = contender.getScore(contest)
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