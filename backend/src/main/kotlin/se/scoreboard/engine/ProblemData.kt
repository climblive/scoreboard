package se.scoreboard.engine

import kotlin.math.max

class ProblemData constructor(
        private val id: Int,
        private var points: Int,
        private var pointsShared: Boolean,
        private var flashBonus: Int?,
        private var flashBonusShared: Boolean) {
    private var ticks: MutableList<TickData> = mutableListOf()
    private var compClassValues: MutableMap<Int, ProblemValue> = mutableMapOf()

    fun linkTick(tick: TickData) {
        ticks.add(tick)
        if (pointsShared) {
            recalculateValues(tick.getCompClass())
        }

        for (tick in ticks) {
            tick.onProblemValueChange()
        }
    }

    fun unlinkTick(tick: TickData) {
        ticks.removeAll { it === tick }
        if (pointsShared) {
            recalculateValues(tick.getCompClass())
        }
    }

    fun onTickUpdated(tick: TickData) {
        if (flashBonusShared) {
            recalculateValues(tick.getCompClass())
        }
    }

    fun getProblemValue(compClass: Int): ProblemValue {
        return compClassValues[compClass] ?: ProblemValue(points, flashBonus)
    }

    fun recalculateAllValues() {
        for (compClass in compClassValues.keys) {
            recalculateValues(compClass)
        }
    }

    private fun recalculateValues(affectedCompClass: Int) {
        data class Counter(var ticks: Int, var flashes: Int)

        fun calcValue(sharedValue: Int?, sharedBy: Int): Int? {
            if (sharedValue == null) {
                return null
            }

            if (sharedBy == 0 || sharedBy == 1) {
                return sharedValue
            }

            return max(sharedValue / sharedBy, 1)
        }

        val counter = Counter(0, 0)

        for (tick in ticks) {
            if (tick.getCompClass() != affectedCompClass) {
                continue
            }

            counter.ticks += 1
            counter.flashes += if (tick.isFlash()) 1 else 0
        }

        compClassValues.put(affectedCompClass, ProblemValue(
                calcValue(points, counter.ticks)!!,
                calcValue(flashBonus, counter.flashes)))
    }
}