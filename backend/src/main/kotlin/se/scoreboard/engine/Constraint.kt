package se.scoreboard.engine

import se.scoreboard.engine.data.TickData

interface Constraint {
    fun check(tick: TickData): Boolean
}