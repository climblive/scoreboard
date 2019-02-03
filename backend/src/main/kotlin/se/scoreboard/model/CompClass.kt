package se.scoreboard.model

import java.time.ZonedDateTime

data class CompClass(
        val name: String,
        val startTime: ZonedDateTime,
        val endTime: ZonedDateTime
)
