package se.scoreboard.dto

data class ColorDto (
    var id: Int?,
    var name: String?,
    var rgb: String) {

    constructor() : this(null, null, "FFFFFF")
}
