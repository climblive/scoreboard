package se.scoreboard.dto

data class ProblemPointValueDto (
    var problemId: Int?,
    var points: Int,
    var flashBonus: Int?) {

    constructor() : this(null, 0, null)
}
