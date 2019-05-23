package se.scoreboard.dto

data class ColorDto (
    var id: Int?,
    var name: String?,
    var rgbPrimary: String,
    var rgbSecondary: String?) {

    constructor() : this(null, null, "#FFFFFF", null)
}
