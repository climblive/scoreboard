package se.scoreboard.engine

class ContenderData constructor(private val id: Int, private val contest: ContestData, private var compClass: Int) {
    private var ticks: MutableList<TickData> = mutableListOf()
    private var score: Int = 0
    private var placement: Int = 0

    init {
        contest.linkContender(this)
    }

    fun linkTick(tick: TickData) {
        ticks.add(tick)
    }

    fun unlinkTick(tick: TickData) {
        ticks.removeAll { it === tick }
    }

    fun getCompClass() = compClass

    fun onTickValueChange(tick: TickData) {
        recalculateScoring()
    }

    fun onPlacementChange(placement: Int) {
        this.placement = placement
    }

    fun getScore() = score

    fun getPlacement() = placement

    fun recalculateScoring(recalculateTicks: Boolean = false) {
        if (recalculateTicks) {
            for (tick in ticks) {
                tick.recalculateValue()
            }
        }

        val updatedScore = ticks.map { it.getValue() }.sum()
        if (updatedScore != score) {
            score = updatedScore
            contest.recalculatePlacements(compClass)
            println("Contender ${id} has a new score of ${score} and placement ${placement}")
        }
    }
}