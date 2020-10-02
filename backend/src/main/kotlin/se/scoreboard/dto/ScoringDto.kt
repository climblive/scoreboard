package se.scoreboard.dto

data class ScoringDto (
    var contenderId: Int,
    var qualifyingScore: Int,
    var qualifyingPlacement: Int,
    var totalScore: Int,
    var totalPlacement: Int,
    var numberOfTicks: Int,
    var isFinalist: Boolean)