package se.scoreboard.api

import org.junit.Assert.*
import org.junit.Test
import se.scoreboard.dto.ContenderDataDTO
import se.scoreboard.mapper.CompClassMapper
import se.scoreboard.mapper.ContenderDataMapper
import se.scoreboard.model.ContenderData
import se.scoreboard.service.ContenderService
import se.scoreboard.storage.DataStorage

internal class ContenderControllerTest {

    val dummyStorage : DummyStorage = DummyStorage()
    val contenderService : ContenderService = ContenderService(dummyStorage, null)
    val contenderController : ContenderController = ContenderController(contenderService, ContenderDataMapper(), CompClassMapper())

    @Test
    fun testGettingNewContender() {
        val contenderData = contenderController.getContenderData("test")
        assertNull(contenderData.name)
        assertNull(contenderData.compClass)
        assertEquals(40, contenderData.problems.size)
    }

    @Test
    fun testUpdatingContender() {
        val code = "test";
        val name = "name";
        val compClass = "compClass";
        var contenderData = contenderController.getContenderData(code)

        // Save a sent problem:
        var newProblems = contenderData.problems.toMutableList()
        newProblems[0] = newProblems[0].copy(sent = true)
        var newData = ContenderDataDTO(code, name, compClass, newProblems)
        contenderController.setContenderData(code, newData)

        contenderData = contenderController.getContenderData(code)

        assertEquals(name, contenderData.name)
        assertEquals(compClass, contenderData.compClass)
        assertTrue(contenderData.problems[0].sent)
        assertFalse(contenderData.problems[1].sent)
        assertEquals(40, contenderData.problems.size)
    }

    @Test
    fun testResultList() {
        dummyStorage.clear()
        dummyStorage.setContenderData(ContenderData(0, "x1", "N1", "Herr", listOf(1,2,3)))
        dummyStorage.setContenderData(ContenderData(1, "x2", "N2", "Herr", listOf(1,2,3)))
        dummyStorage.setContenderData(ContenderData(2, "x3", "N3", "Herr", listOf(1,2,3)))
        dummyStorage.setContenderData(ContenderData(3, "x4", "N4", "Herr", emptyList()))
        dummyStorage.setContenderData(ContenderData(4, "x5", "N5", "Dam", listOf(1)))

        val scoreboard = contenderController.getScoreboard()
        println(scoreboard)
        assertEquals(3, scoreboard.size)
        assertEquals(4, scoreboard[0].contenders.size)
    }

    class DummyStorage : DataStorage {
        private val database : MutableMap<String, ContenderData> = HashMap()

        override fun getContenderData(code: String): ContenderData? = database[code]

        override fun setContenderData(data: ContenderData) {
            database[data.code] = data
        }

        override fun getAllContenders(): List<ContenderData> = database.values.toList()

        fun clear() = database.clear()
    }
}
