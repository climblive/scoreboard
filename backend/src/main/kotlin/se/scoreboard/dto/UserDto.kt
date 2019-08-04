package se.scoreboard.dto

data class UserDto (
    var id: Int?,
    var name: String?,
    var username: String?,
    var isAdmin: Boolean) {

    constructor() : this(null, null, null, false)
}
