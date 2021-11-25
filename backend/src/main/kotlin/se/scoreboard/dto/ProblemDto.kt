package se.scoreboard.dto

data class ProblemDto (
    var id: Int?,
    var organizerId: Int?,
    var colorId: Int?,
    var contestId: Int?,
    var number: Int,
    var name: String?,
    var points: Int,
    var flashBonus: Int?) {

    constructor() : this(null, null, null, null, Int.MAX_VALUE, null, Int.MAX_VALUE, null)
}
