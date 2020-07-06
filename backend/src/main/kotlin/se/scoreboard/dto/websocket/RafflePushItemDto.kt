package se.scoreboard.dto.scoreboard

import com.fasterxml.jackson.annotation.JsonProperty

data class RafflePushItemDto (
    val raffleId: Int,
    @JsonProperty("active")
    val active: Boolean)
