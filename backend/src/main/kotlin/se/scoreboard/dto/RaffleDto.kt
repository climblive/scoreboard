package se.scoreboard.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class RaffleDto (
    var id: Int?,
    var contestId: Int,
    @JsonProperty("isActive")
    var isActive: Boolean = false) {

    constructor() : this(null, Int.MIN_VALUE, false)
}
