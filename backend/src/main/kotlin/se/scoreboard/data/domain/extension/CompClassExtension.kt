package se.scoreboard.data.domain.extension

import se.scoreboard.data.domain.CompClass
import java.time.Instant
import java.util.*

fun CompClass.allowedToAlterContender() : Boolean {
    val now = Date()
    return now.toInstant().isBefore(timeEndWithGracePeriod())
}

fun CompClass.allowedToAlterTick() : Boolean {
    val now = Date()
    return now.after(timeBegin) && now.toInstant().isBefore(timeEndWithGracePeriod())
}

private fun CompClass.timeEndWithGracePeriod() : Instant {
    val gracePeriod: Int = contest?.gracePeriod ?: 0
    return timeEnd!!.toInstant().plusSeconds(gracePeriod.toLong())
}
