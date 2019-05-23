package se.scoreboard.dto

import java.time.OffsetDateTime

data class TickDto (
    var id: Int?,
    var timestamp: OffsetDateTime?,
    var contenderId: Int?,
    var problemId: Int?,
    var isFlash: Boolean = false) {

    constructor() : this(null, null, null, null, false)
}
