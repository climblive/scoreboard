package se.scoreboard.dto

data class OrganizerDto (
    var id: Int?,
    var name: String?,
    var homepage: String?) {

    constructor() : this(null, null, null)
}
