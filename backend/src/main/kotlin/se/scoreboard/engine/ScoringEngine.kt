package se.scoreboard.engine

import org.springframework.scheduling.annotation.Async
import se.scoreboard.dto.ScoringDto
import se.scoreboard.dto.CurrentPointsDto
import se.scoreboard.engine.params.ActionParam

interface ScoringEngine {
    @Async
    fun dispatch(action: ActionType, parameter: ActionParam)
    fun await(action: ActionType, parameter: ActionParam)

    fun getScorings(contenderId: Int): List<ScoringDto>?
    fun getCurrentPoints(problemId: Int): List<CurrentPointsDto>?
}