package se.scoreboard.dto

data class CurrentPointsDto (
    var problemId: Int,
    var compClassId: Int,
    var points: Int,
    var flashBonus: Int?)
