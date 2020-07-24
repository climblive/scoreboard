package se.scoreboard.engine.params

data class RegisterTickParam(
        val tickId: Int,
        val problemId: Int,
        val contenderId: Int,
        val isFlash: Boolean) : ActionParam