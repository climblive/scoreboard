package se.scoreboard.storage

import se.scoreboard.model.ContenderData

interface DataStorage {
    fun getContenderData(code: String): ContenderData?
    fun setContenderData(data: ContenderData)
    fun getAllContenders(): List<ContenderData>
}