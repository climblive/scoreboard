package se.scoreboard.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class ContestDto (
    var id: Int?,
    var locationId: Int?,
    var organizerId: Int?,
    var seriesId: Int?,
    var name: String?,
    var description: String?,
    @JsonProperty("finalEnabled")
    var isFinalEnabled: Boolean,
    var qualifyingProblems: Int,
    var finalists: Int,
    var rules: String?,
    var gracePeriod: Int?,
    var scoreboardUrl: String?) {

    constructor() : this(null, null, null, null, null, null, false, Int.MAX_VALUE, Int.MAX_VALUE, null, null, null)
}
