package se.scoreboard.dto.scoreboard

import java.time.OffsetDateTime

data class RaffleWinnerPushItemDto (val raffleId: Int, val contenderId: Int, val contenderName : String, val timestamp: OffsetDateTime)
