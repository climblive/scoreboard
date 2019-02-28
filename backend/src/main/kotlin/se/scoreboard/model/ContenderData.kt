package se.scoreboard.model

data class ContenderData(
        var id: Int,
        val code : String,
        val name : String,
        val compClass : String,
        var sentProblems : List<Int>
) {
    fun isProblemSent(id: Int): Boolean = sentProblems.contains(id)

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
};
