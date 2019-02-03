package se.scoreboard.service

import com.google.gson.*
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
import java.time.ZonedDateTime


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
}