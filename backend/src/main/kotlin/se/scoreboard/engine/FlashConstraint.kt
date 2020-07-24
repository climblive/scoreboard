package se.scoreboard.engine

import se.scoreboard.engine.data.TickData

class FlashConstraint : Constraint {
    override fun check(tick: TickData): Boolean = tick.flash
}