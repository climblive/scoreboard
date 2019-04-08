package se.scoreboard.data.domain.extension

import se.scoreboard.data.domain.CompClass
import java.util.*

fun CompClass.isInProgress() : Boolean {
    val now = Date();
    return now.after(timeBegin) && now.before(timeEnd)
}