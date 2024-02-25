package se.scoreboard.dto

import java.time.OffsetDateTime

data class RaffleWinnerDto (
    var id: Int?,
    var raffleId: Int,
    var contenderId: Int,
    var contenderName: String,
    var timestamp: OffsetDateTime) {

    constructor() : this(null, Int.MIN_VALUE, Int.MIN_VALUE, "", OffsetDateTime.MIN)
}
