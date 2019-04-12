package se.scoreboard.data.domain.extension

import se.scoreboard.data.domain.CompClass
import java.util.*

fun CompClass.allowedToAlterContender() : Boolean {
    val now = Date()
    return now.before(timeEnd)
}

fun CompClass.allowedToAlterTick() : Boolean {
    val now = Date()
    return now.after(timeBegin) && now.toInstant().isBefore(timeEnd!!.toInstant().plusSeconds(3 * 60))
}