package se.scoreboard.engine.data

import se.scoreboard.dto.ScoringDto

class ContenderData (
        val id: Int,
        val contest: ContestData,
        _compClass: Int,
        private val enqueueScoringBroadcast: (contestId: Int, scoring: ScoringDto) -> Unit) {

    val ticks: MutableList<TickData> = mutableListOf()

    var score: Int = 0
        set(value) {
           field = value
           scoring.score = value
        }

    var placement: Int = 0
        set(value) {
            val changed = (value != field)

            field = value
            scoring.placement = value

            if (changed) {
                enqueueScoringBroadcast(contest.id, scoring)
            }
        }

    var scoring: ScoringDto = ScoringDto(id, 0, 0, 0)
        private set

    var compClass = _compClass
    set(value) {
        if (field != value) {
            ticks.forEach {
                //it.problem.recalculateAllValues()
            }
        }

        field = value
    }

    init {
        contest.linkContender(this)
    }

    fun linkTick(tick: TickData) {
        ticks.add(tick)
    }

    fun unlinkTick(tick: TickData) {
        ticks.removeAll { it === tick }
    }

    fun purge() {
        contest.unlinkContender(this)
    }

    fun onTickValueChange() {
        recalculateScoring()
    }

    fun recalculateScoring(recalculateTicks: Boolean = false) {
        if (recalculateTicks) {
            for (tick in ticks) {
                tick.recalculateValue()
            }
        }

        var counter = 1
        ticks.sortBy { it.value }
        ticks.map { it.order = counter++ }

        val updatedScore = ticks.filter { contest.rule?.checkConstraints(it) ?: false }.map { it.value }.sum()
        if (updatedScore != score) {
            score = updatedScore
            contest.recalculatePlacements(compClass)
            enqueueScoringBroadcast(contest.id, scoring)
        }
    }
}