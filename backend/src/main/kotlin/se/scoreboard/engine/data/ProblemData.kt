package se.scoreboard.engine.data

import se.scoreboard.dto.CurrentPointsDto
import se.scoreboard.engine.PointsMode
import se.scoreboard.engine.ProblemValue
import se.scoreboard.service.BroadcastService
import kotlin.math.max

class ProblemData constructor(
        private val id: Int,
        private val contest: ContestData,
        private var points: Int,
        private var pointsMode: PointsMode,
        private var flashBonus: Int?,
        private var flashBonusMode: PointsMode) {
    val ticks: MutableList<TickData> = mutableListOf()
    private var pointsByCompClass: MutableMap<Int, ProblemValue> = mutableMapOf()

    companion object {
        var broadcastService: BroadcastService? = null
    }

    private fun sharedPointsMode(): Boolean {
        return pointsMode == PointsMode.SHARED || flashBonusMode == PointsMode.SHARED
    }

    fun linkTick(tick: TickData) {
        ticks.add(tick)
        if (sharedPointsMode()) {
            recalculateValuesAndUpdateTicks(tick)
        }
    }

    fun unlinkTick(tick: TickData) {
        ticks.removeAll { it === tick }
        if (sharedPointsMode()) {
            recalculateValuesAndUpdateTicks(tick)
        }
    }

    fun onTickUpdated(tick: TickData) {
        if (sharedPointsMode()) {
            recalculateValuesAndUpdateTicks(tick)
        }
    }

    fun updatePoints(points: Int, pointsMode: PointsMode,
                     flashBonus: Int?, flashBonusMode: PointsMode) {
        this.points = points
        this.pointsMode = pointsMode
        this.flashBonus = flashBonus
        this.flashBonusMode = flashBonusMode

        recalculateAllValues()
        for (tick in ticks) {
            tick.onProblemValueChange()
        }
    }

    private fun recalculateValuesAndUpdateTicks(tick: TickData) {
        recalculateValues(tick.getCompClass())

        for (tick in ticks) {
            tick.onProblemValueChange()
        }
    }

    fun getProblemValue(compClass: Int): ProblemValue {
        return pointsByCompClass[compClass] ?: ProblemValue(points, flashBonus)
    }

    fun recalculateAllValues() {
        for (compClass in pointsByCompClass.keys) {
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
            counter.flashes += if (tick.flash) 1 else 0
        }

        val pv = ProblemValue(
                calcValue(points, counter.ticks)!!,
                calcValue(flashBonus, counter.flashes))

        if (pv != pointsByCompClass[affectedCompClass]) {
            pointsByCompClass.put(affectedCompClass, pv)
            broadcastService?.broadcast(contest.id, CurrentPointsDto(id, affectedCompClass, pv.points, pv.flashBonus))
        }
    }

    fun getCurrentPoints(): List<CurrentPointsDto> {
        val values: MutableList<CurrentPointsDto> = mutableListOf()

        for ((compClassId, value) in pointsByCompClass) {
            values.add(CurrentPointsDto(id, compClassId, value.points, value.flashBonus))
        }

        return values
    }
}