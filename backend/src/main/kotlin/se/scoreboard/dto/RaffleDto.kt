package se.scoreboard.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class RaffleDto (
    var id: Int?,
    var contestId: Int,
    @JsonProperty("active")
    var active: Boolean = false) {

    constructor() : this(null, Int.MIN_VALUE, false)
}
