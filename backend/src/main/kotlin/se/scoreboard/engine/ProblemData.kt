package se.scoreboard.engine

import se.scoreboard.dto.ProblemPointValueDto
import se.scoreboard.service.BroadcastService
import kotlin.math.max

class ProblemData constructor(
        private val id: Int,
        private val contest: ContestData,
        private var points: Int,
        private var pointsShared: Boolean,
        private var flashBonus: Int?,
        private var flashBonusShared: Boolean) {
    private var ticks: MutableList<TickData> = mutableListOf()
    private var compClassValues: MutableMap<Int, ProblemValue> = mutableMapOf()

    companion object {
        var broadcastService: BroadcastService? = null
    }

    fun linkTick(tick: TickData) {
        ticks.add(tick)
        if (pointsShared) {
            recalculateValuesAndUpdateTicks(tick)
        }
    }

    fun unlinkTick(tick: TickData) {
        ticks.removeAll { it === tick }
        if (pointsShared) {
            recalculateValuesAndUpdateTicks(tick)
        }
    }

    fun onTickUpdated(tick: TickData) {
        if (flashBonusShared) {
            recalculateValuesAndUpdateTicks(tick)
        }
    }

    private fun recalculateValuesAndUpdateTicks(tick: TickData) {
        recalculateValues(tick.getCompClass())

        for (tick in ticks) {
            tick.onProblemValueChange()
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

        val pv = ProblemValue(
                calcValue(points, counter.ticks)!!,
                calcValue(flashBonus, counter.flashes))
        val oldPv = compClassValues[affectedCompClass]
        compClassValues.put(affectedCompClass, pv)

        if (pv != oldPv) {
            broadcastService?.broadcast(contest.id, ProblemPointValueDto(id, pv.points, pv.flashBonus))
        }
    }
}