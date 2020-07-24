package se.scoreboard.dto

data class ScoringDto (
        var contenderId: Int,
        var ruleId: Int,
        var score: Int,
        var placement: Int)