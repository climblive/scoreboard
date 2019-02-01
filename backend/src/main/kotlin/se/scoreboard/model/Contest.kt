package se.scoreboard.model

data class Contest(
        val name: String,
        val compClasses : List<String>,
        val problems : List<Problem>
) {
    fun getProblem(id: Int): Problem? = problems.find { it.id == id }
}