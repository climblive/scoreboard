package se.scoreboard.dto

data class ProblemDto (
    var id: Int?,
    var colorId: Int?,
    var contestId: Int?,
    var number: Int,
    var points: Int,
    var flashBonus: Int?) {

    constructor() : this(null, null, null, Int.MAX_VALUE, Int.MAX_VALUE, null)
}
