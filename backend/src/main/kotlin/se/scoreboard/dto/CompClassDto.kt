package se.scoreboard.dto

import java.time.OffsetDateTime

data class CompClassDto (
    var id: Int?,
    var contestId: Int?,
    var name: String?,
    var description: String?,
    var color: String?,
    var timeBegin: OffsetDateTime?,
    var timeEnd: OffsetDateTime?) {

    constructor() : this(null, null, null, null, null, null, null)
}
