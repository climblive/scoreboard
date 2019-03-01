package se.scoreboard.model

data class ContenderData(
        var id: Int,
        val code : String,
        val name : String,
        val compClass : String,
        var sentProblems : List<Int>
) {
    fun isProblemSent(id: Int): Boolean = sentProblems.contains(id)

    fun getProblemState(id: Int): ProblemState = when(sentProblems.contains(id)) {
        true -> ProblemState.SENT
        false -> ProblemState.NOT_SENT
    }

    private fun getPoints(contest: Contest) : List<Int> = sentProblems.map{contest.getProblem(it)!!.points}

    fun getScore(contest: Contest): Int {
        val points = getPoints(contest);
        if(points.isEmpty()) {
            return 0
        }
        return points.reduce{a, b -> a + b}
    }


    fun getTenBestScore(contest: Contest): Int {
        val points : List<Int> = getPoints(contest).sorted()
        if(points.isEmpty()) {
            return 0
        }
        return points.subList(Math.max(0, points.size - 10), points.size).reduce{a, b -> a + b}
    }

    fun setProblemState(problemId: Int, state: ProblemState) {
        sentProblems = sentProblems.filter { it != problemId }
        if(state != ProblemState.NOT_SENT) {
            val newList = sentProblems.toMutableList()
            newList.add(problemId)
            sentProblems = newList
        }
    }
};
