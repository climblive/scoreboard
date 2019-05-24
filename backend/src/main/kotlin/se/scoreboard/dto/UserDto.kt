package se.scoreboard.dto

data class UserDto (
    var id: Int?,
    var name: String?,
    var email: String?,
    var password: String?,
    var isAdmin: Boolean) {

    constructor() : this(null, null, null, null, false)
}
