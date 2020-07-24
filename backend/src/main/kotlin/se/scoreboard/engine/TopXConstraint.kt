package se.scoreboard.engine

import se.scoreboard.engine.data.TickData

class TopXConstraint(private val minOrder: Int) : Constraint {
    override fun check(tick: TickData): Boolean = tick.order <= minOrder
}