package se.scoreboard.dto

import java.util.*

data class TickDto (
    var id: Int?,
    var timestamp: Date?,
    var contenderId: Int?,
    var problemId: Int?,
    var isFlash: Boolean = false) {

    constructor() : this(null, null, null, null, false)
}
