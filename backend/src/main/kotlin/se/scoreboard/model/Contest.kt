package se.scoreboard.model

data class Contest(
        val name: String,
        val rules: String,
        val compClasses : List<CompClass>,
        val problems : List<Problem>
) {
    fun getProblem(id: Int): Problem? = problems.find { it.id == id }
}