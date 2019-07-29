package se.scoreboard.dto

data class ContestDto (
    var id: Int?,
    var locationId: Int?,
    var organizerId: Int?,
    var seriesId: Int?,
    var name: String?,
    var description: String?,
    var qualifyingProblems: Int,
    var finalists: Int,
    var rules: String?,
    var gracePeriod: Int?) {

    constructor() : this(null, null, null, null, null, null, Int.MAX_VALUE, Int.MAX_VALUE, null, null)
}
