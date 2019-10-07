package se.scoreboard.dto

data class ColorDto (
    var id: Int?,
    var organizerId: Int?,
    var name: String?,
    var rgbPrimary: String,
    var rgbSecondary: String?,
    var shared: Boolean) {

    constructor() : this(null, null, null, "#FFFFFF", null, false)
}
