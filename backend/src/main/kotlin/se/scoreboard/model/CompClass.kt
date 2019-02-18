package se.scoreboard.model

import java.time.ZonedDateTime

data class CompClass(
        val name: String,
        val description: String,
        val startTime: ZonedDateTime,
        val endTime: ZonedDateTime
)
