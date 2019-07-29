package se.scoreboard.dto

data class SeriesDto (
    var id: Int?,
    var organizerId: Int?,
    var name: String?) {

    constructor() : this(null, null, null)
}
