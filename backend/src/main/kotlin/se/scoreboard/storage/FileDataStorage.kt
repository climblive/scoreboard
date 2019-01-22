package se.scoreboard.storage

import com.google.gson.Gson
import org.springframework.stereotype.Service
import se.scoreboard.model.ContenderData
import java.io.File

@Service
class FileDataStorage : DataStorage {

    val fileName = "database.json"

    private fun loadFile() : Database {
        val string : String = File(fileName).readText()
        return Gson().fromJson(string, Database::class.java)
    }

    private fun saveFile(database : Database) {
        File(fileName).writeText(Gson().toJson(database))
    }


    @Synchronized
    override fun getContenderData(code: String): ContenderData? {
        return loadFile().contenderData[code]
    }

    @Synchronized
    override fun setContenderData(data: ContenderData) {
        val database = loadFile()
        database.contenderData[data.code] = data
        saveFile(database)
    }

    data class Database(val contenderData : MutableMap<String, ContenderData>);
}