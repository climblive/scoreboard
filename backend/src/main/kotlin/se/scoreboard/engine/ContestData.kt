package se.scoreboard.engine

class ContestData(val id: Int) {
    private var contendersMap: MutableMap<Int, MutableList<ContenderData>> = mutableMapOf()

    fun linkContender(contender: ContenderData) {
        var contenders = contendersMap.getOrPut(contender.getCompClass(), { mutableListOf() })
        contenders.add(contender)
    }

    fun unlinkContender(contender: ContenderData) {
        contendersMap[contender.getCompClass()]?.removeAll { it === contender }
    }

    fun recalculatePlacements(compClass: Int) {
        var contenders = contendersMap[compClass]
        contenders?.sortByDescending { it.getScore() }

        if (contenders == null) {
            return
        }

        var placement = 0
        var score = 0

        for (contender in contenders) {
            if (contender.getScore() != score) {
                score = contender.getScore()
                placement += 1
            }

            contender.onPlacementChange(placement)
        }
    }
}