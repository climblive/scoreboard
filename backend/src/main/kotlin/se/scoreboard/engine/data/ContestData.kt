package se.scoreboard.engine.data

import se.scoreboard.engine.ContestRule
import se.scoreboard.engine.TopXConstraint

class ContestData(val id: Int) {
    var rule: ContestRule? = null
        private set
    private var contendersByCompClass: MutableMap<Int, MutableList<ContenderData>> = mutableMapOf()

    init {
        // TODO: Test
        rule = ContestRule(1)
        rule?.constraints?.add(TopXConstraint(3))
    }

    fun linkContender(contender: ContenderData) {
        var contenders = contendersByCompClass.getOrPut(contender.compClass, { mutableListOf() })
        contenders.add(contender)
    }

    fun unlinkContender(contender: ContenderData) {
        contendersByCompClass[contender.compClass]?.removeAll { it === contender }
    }

    fun recalculatePlacements(compClass: Int) {
        var contenders = contendersByCompClass[compClass]
        contenders?.sortByDescending { it.score }

        if (contenders == null) {
            return
        }

        var placement = 0
        var score = 0

        for (contender in contenders) {
            if (contender.score != score) {
                score = contender.score
                placement += 1
            }

            contender.placement = placement
        }
    }
}