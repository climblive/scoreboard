package se.scoreboard.dto

data class RaffleDto (
    var id: Int?,
    var contestId: Int,
    var isActive: Boolean = false) {

    constructor() : this(null, Int.MIN_VALUE, false)
}
