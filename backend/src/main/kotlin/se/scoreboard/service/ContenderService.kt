package se.scoreboard.service

import com.google.gson.Gson
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.model.ContenderData
import se.scoreboard.model.Contest
import se.scoreboard.model.Problem
import se.scoreboard.storage.DataStorage
import se.scoreboard.storage.FileDataStorage

@Service
class ContenderService @Autowired constructor(private val dataStorage: DataStorage) {

    fun getContest(): Contest {
        var gson = Gson()
        val fileContent = FileDataStorage::class.java.getResource("/contest.json").readText()
        return gson.fromJson(fileContent, Contest::class.java)
    }

    fun getProblems() :List<Problem> = getContest().problems

    fun getContenderData(code: String) : ContenderData? = dataStorage.getContenderData(code)

    fun setContenderData(data : ContenderData) = dataStorage.setContenderData(data)

    fun getAllContenders() = dataStorage.getAllContenders()
}