package se.scoreboard

import com.google.gson.Gson
import org.springframework.stereotype.Service
import se.scoreboard.model.Contest
import se.scoreboard.model.Problem

@Service
class FileDataStorage : DataStorage {
    override fun getContest(): Contest {
        var gson = Gson();
        val fileContent = FileDataStorage::class.java.getResource("/contest.json").readText()
        return gson.fromJson(fileContent, Contest::class.java)
    }

}