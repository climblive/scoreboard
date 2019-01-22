package se.scoreboard

import junit.framework.Assert.assertEquals
import org.junit.Test
import se.scoreboard.model.Problem

internal class UserServiceTest {

    private val userService : UserService = UserService(FileDataStorage());

    @Test
    fun testStuff() {
        val problems: List<Problem> = userService.getProblems();
        assertEquals(5, problems.size);
    }

}