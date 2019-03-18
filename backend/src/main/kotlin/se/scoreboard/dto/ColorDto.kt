package se.scoreboard.dto

data class ColorDto (
    var id: Int?,
    var name: String?,
    var red: Int,
    var green: Int,
    var blue: Int) {

    constructor() : this(null, null, 0, 0, 0)
}
