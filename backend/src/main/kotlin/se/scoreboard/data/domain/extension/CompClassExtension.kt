package se.scoreboard.data.domain.extension

import se.scoreboard.data.domain.CompClass
import se.scoreboard.userHasRole
import java.time.OffsetDateTime

fun CompClass.allowedToAlterContender() : Boolean {
    val now = OffsetDateTime.now()
    if (userHasRole("CONTENDER")) {
        return now.isBefore(timeEndWithGracePeriod())
    } else {
        return true
    }
}

fun CompClass.allowedToAlterTick() : Boolean {
    val now = OffsetDateTime.now()
    if (userHasRole("CONTENDER")) {
        return now.isAfter(timeBegin) && now.isBefore(timeEndWithGracePeriod())
    } else {
        return true
    }
}

private fun CompClass.timeEndWithGracePeriod() : OffsetDateTime {
    val gracePeriod: Int = contest?.gracePeriod ?: 0
    return timeEnd!!.plusMinutes(gracePeriod.toLong())
}
