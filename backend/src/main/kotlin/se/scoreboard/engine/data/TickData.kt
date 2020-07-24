package se.scoreboard.engine.data

class TickData (
        val id: Int,
        private val contender: ContenderData,
        private val problem: ProblemData,
        _flash: Boolean) {
    var value: Int = 0
        private set

    var flash: Boolean = _flash
        set(value) {
            field = value
            problem.onTickUpdated(this)
        }

    init {
        contender.linkTick(this)
        problem.linkTick(this)
    }

    fun purge() {
        problem.unlinkTick(this)
        contender.unlinkTick(this)
        contender.recalculateScoring()
    }

    fun getCompClass() = contender.compClass

    fun onProblemValueChange() {
        if (recalculateValue()) {
            contender.onTickValueChange()
        }
    }

    fun recalculateValue(): Boolean {
        val problemValue = problem.getProblemValue(contender.compClass)
        problemValue.let {
            var updatedValue = it.points
            if (flash) {
                updatedValue += it.flashBonus ?: 0
            }

            if (updatedValue != value) {
                value = updatedValue
                return true
            }
        }

        return false
    }
}