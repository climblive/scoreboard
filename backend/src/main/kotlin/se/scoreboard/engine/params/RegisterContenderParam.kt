package se.scoreboard.engine.params

data class RegisterContenderParam(
        val contenderId: Int,
        val contestId: Int,
        val compClassId: Int) : ActionParam