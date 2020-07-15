package se.scoreboard.engine

import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Tick
import se.scoreboard.dto.ScoringDto
import kotlin.random.Random

class DummyScoringEngine : ScoringEngine {
    override fun registerTick(tick: Tick) {
    }

    override fun unregisterTick(tickId: Int) {
    }

    override fun getScoring(contenderId: Int): ScoringDto? {
        return ScoringDto(
            contenderId,
            Random.nextInt(0, 2000),
            Random.nextInt(1, 10),
            Random.nextInt(0, 5000),
            Random.nextInt(1, 50))
    }
}