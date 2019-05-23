package se.scoreboard.data.domain.extension

import se.scoreboard.data.domain.CompClass
import java.time.Instant
import java.time.OffsetDateTime
import java.util.*

fun CompClass.allowedToAlterContender() : Boolean {
    val now = OffsetDateTime.now()
    return now.isBefore(timeEndWithGracePeriod())
}

fun CompClass.allowedToAlterTick() : Boolean {
    val now = OffsetDateTime.now()
    return now.isAfter(timeBegin) && now.isBefore(timeEndWithGracePeriod())
}

private fun CompClass.timeEndWithGracePeriod() : OffsetDateTime {
    val gracePeriod: Int = contest?.gracePeriod ?: 0
    return timeEnd!!.plusSeconds(gracePeriod.toLong())
}
