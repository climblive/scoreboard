package se.scoreboard.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class ColorDto (
    var id: Int?,
    var organizerId: Int?,
    var name: String?,
    var rgbPrimary: String,
    var rgbSecondary: String?,
    @JsonProperty("shared")
    var shared: Boolean) {

    constructor() : this(null, null, null, "#FFFFFF", null, false)
}
