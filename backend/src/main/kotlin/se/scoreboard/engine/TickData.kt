package se.scoreboard.engine

class TickData constructor(
        private val id: Int,
        private val contender: ContenderData,
        private val problem: ProblemData,
        private var flash: Boolean) {
    private var value: Int = 0

    init {
        contender.linkTick(this)
        problem.linkTick(this)
    }

    fun purge() {
        problem.unlinkTick(this)
        contender.unlinkTick(this)
    }

    fun updateFlash(flash: Boolean) {
        this.flash = flash
        problem.onTickUpdated(this)
    }

    fun getCompClass() = contender.getCompClass()

    fun onProblemValueChange() {
        if (recalculateValue()) {
            contender.onTickValueChange(this)
        }
    }

    fun recalculateValue(): Boolean {
        val problemValue = problem.getProblemValue(contender.getCompClass())
        problemValue?.let {
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

    fun getValue() = value

    fun isFlash() = flash
}