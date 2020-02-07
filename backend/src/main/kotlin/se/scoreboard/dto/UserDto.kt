package se.scoreboard.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class UserDto (
    var id: Int?,
    var name: String?,
    var username: String?,
    @JsonProperty("isAdmin")
    var isAdmin: Boolean) {

    constructor() : this(null, null, null, false)
}
