package se.scoreboard.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class UserDto (
    var id: Int?,
    var name: String?,
    var username: String?,
    @JsonProperty("admin")
    var admin: Boolean,
    @JsonProperty("organizers")
    var organizers : List<OrganizerDto>?) {

    constructor() : this(null, null, null, false, null)
}
