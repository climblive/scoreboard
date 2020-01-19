package se.scoreboard.dto

data class ScoreboardDto (val contestId: Int, val raffles: List<RaffleWinnerListDto>, val scores: List<ScoreboardListDto>)
