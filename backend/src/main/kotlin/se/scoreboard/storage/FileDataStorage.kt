package se.scoreboard.storage

import com.google.gson.Gson
import org.springframework.stereotype.Service
import se.scoreboard.model.ContenderData
import java.io.File

@Service
class FileDataStorage : DataStorage {

    val fileName = "database.json"

    private fun loadFile() : Database {
        val file = File(fileName)
        if(file.exists()) {
            val string: String = file.readText();
            return Gson().fromJson(string, Database::class.java)
        } else {
            return Database(HashMap(), 0)
        }
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
        var oldData = database.contenderData[data.code]
        if(oldData != null) {
            if(data.sentProblems == null) {
                data.sentProblems = oldData.sentProblems;
            }
        } else {
            database.lastId++
            data.id = database.lastId
        }
        database.contenderData[data.code] = data
        saveFile(database)
    }

    override fun getAllContenders(): List<ContenderData> = loadFile().contenderData.values.toList()

    data class Database(val contenderData : MutableMap<String, ContenderData>, var lastId: Int)
}