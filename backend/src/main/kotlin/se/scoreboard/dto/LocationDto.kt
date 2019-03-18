package se.scoreboard.dto

data class LocationDto (
    var id: Int?,
    var name: String?,
    var longitude: String?,
    var latitude: String?) {

    constructor() : this(null, null, null, null)
}
