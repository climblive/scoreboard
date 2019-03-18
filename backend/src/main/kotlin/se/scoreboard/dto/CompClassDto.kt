package se.scoreboard.dto

import java.util.*

data class CompClassDto (
    var id: Int?,
    var contestId: Int?,
    var name: String?,
    var description: String?,
    var timeBegin: Date?,
    var timeEnd: Date?) {

    constructor() : this(null, null, null, null, null, null)
}
