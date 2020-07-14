package se.scoreboard.engine.params

import se.scoreboard.engine.PointsMode

data class RegisterProblemParam(
        val problemId: Int,
        val contestId: Int,
        val points: Int,
        val pointsMode: PointsMode,
        val flashBonus: Int?,
        val flashBonusMode: PointsMode) : ActionParam