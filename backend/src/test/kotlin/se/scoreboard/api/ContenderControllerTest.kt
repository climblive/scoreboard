package se.scoreboard.api

import org.junit.Assert.*
import org.junit.Test
import se.scoreboard.dto.ContenderDataDTO
import se.scoreboard.mapper.ContenderDataMapper
import se.scoreboard.model.ContenderData
import se.scoreboard.service.ContenderService
import se.scoreboard.storage.DataStorage

internal class ContenderControllerTest {

    val dummyStorage : DummyStorage = DummyStorage()
    val contenderService : ContenderService = ContenderService(dummyStorage)
    val contenderController : ContenderController = ContenderController(contenderService, ContenderDataMapper())

    @Test
    fun testGettingNewContender() {
        val contenderData = contenderController.getContenderData("test")
        assertNull(contenderData.name)
        assertNull(contenderData.compClass)
        assertEquals(5, contenderData.problems.size)
    }

    @Test
    fun testUpdatingContender() {
        val code = "test";
        val name = "name";
        val compClass = "compClass";
        var contenderData = contenderController.getContenderData(code)

        // Save a sent problem:
        var newProblems = contenderData.problems.toMutableList()
        newProblems[0] = newProblems[0].copy(isSent = true)
        var newData = ContenderDataDTO(name, compClass, newProblems)
        contenderController.setContenderData(code, newData)

        contenderData = contenderController.getContenderData(code)

        assertEquals(name, contenderData.name)
        assertEquals(compClass, contenderData.compClass)
        assertTrue(contenderData.problems[0].isSent)
        assertFalse(contenderData.problems[1].isSent)
        assertEquals(5, contenderData.problems.size)
    }

    class DummyStorage : DataStorage {

        private val database : MutableMap<String, ContenderData> = HashMap()

        override fun getContenderData(code: String): ContenderData? = database[code];

        override fun setContenderData(data: ContenderData) {
            database[data.code] = data;
        }
    }
}