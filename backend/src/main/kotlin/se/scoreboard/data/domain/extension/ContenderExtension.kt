package se.scoreboard.data.domain.extension

import se.scoreboard.data.domain.Contender

fun Contender.getPoints(): List<Int> {
    return ticks.map { tick -> tick.problem?.points }.filterNotNull()
}

fun Contender.getTotalScore(): Int {
    return getPoints().sum()
}

fun Contender.getQualificationScore(): Int {
    val qualifyingProblems = contest?.qualifyingProblems ?: return 0
    return getPoints().sorted().takeLast(qualifyingProblems).sum()
}