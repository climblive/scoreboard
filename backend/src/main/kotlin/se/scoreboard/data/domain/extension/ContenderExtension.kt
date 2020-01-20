package se.scoreboard.data.domain.extension

import se.scoreboard.data.domain.Contender

fun Contender.getPoints(): List<Int> {
    return ticks.map { tick ->
        tick.problem?.let {
            var points = it.points
            if (tick.isFlash) {
                points += it.flashBonus ?: 0
            }
            points
        }
    }.filterNotNull()
}

fun Contender.getTotalScore(): Int {
    if (!disqualified) {
        return getPoints().sum()
    } else {
        return 0
    }
}

fun Contender.getQualificationScore(): Int {
    if (!disqualified) {
        val qualifyingProblems = contest?.qualifyingProblems ?: return 0
        return getPoints().sorted().takeLast(qualifyingProblems).sum()
    } else {
        return 0
    }
}