package se.scoreboard.dto

data class ProblemDto (
    var id: Int?,
    var colorId: Int?,
    var color: ColorDto?,
    var contestId: Int?,
    var number: Int,
    var name: String?,
    var description: String?,
    var points: Int,
    var flashBonus: Int?) {

    constructor() : this(null, null, null, null, Int.MAX_VALUE, null, null, Int.MAX_VALUE, null)
}
