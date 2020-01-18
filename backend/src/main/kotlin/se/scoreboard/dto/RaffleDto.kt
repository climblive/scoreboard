package se.scoreboard.dto

data class RaffleDto (
    var id: Int?,
    var contestId: Int) {

    constructor() : this(null, Int.MIN_VALUE)
}
