package se.scoreboard.engine

import se.scoreboard.engine.data.TickData

class ContestRule(val id: Int) {
    var constraints: MutableList<Constraint> = mutableListOf()
        private set

    fun checkConstraints(tick: TickData): Boolean {
        for (constraint in constraints) {
            if (!constraint.check(tick)) {
                return false
            }
        }

        return true
    }
}