package se.scoreboard.dto

import com.fasterxml.jackson.annotation.JsonProperty
import java.time.OffsetDateTime

data class ContestDto (
    var id: Int?,
    var location: String?,
    var organizerId: Int?,
    var seriesId: Int?,
    @JsonProperty("protected")
    var protected: Boolean = false,
    var name: String?,
    var description: String?,
    @JsonProperty("finalEnabled")
    var finalEnabled: Boolean,
    var qualifyingProblems: Int,
    var finalists: Int,
    var rules: String?,
    var gracePeriod: Int?,
    var scoreboardUrl: String?,
    var timeBegin: OffsetDateTime?,
    var timeEnd: OffsetDateTime?) {

    constructor() : this(null, null, null, null, false, null, null, false, Int.MAX_VALUE, Int.MAX_VALUE, null, null, null, null, null)
}
