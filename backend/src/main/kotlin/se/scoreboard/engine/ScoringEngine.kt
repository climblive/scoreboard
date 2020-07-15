package se.scoreboard.engine

import se.scoreboard.data.domain.Tick
import se.scoreboard.dto.ScoringDto

interface ScoringEngine {
    fun registerTick(tick: Tick)
    fun unregisterTick(tickId: Int)

    fun getScoring(contenderId: Int): ScoringDto?
}