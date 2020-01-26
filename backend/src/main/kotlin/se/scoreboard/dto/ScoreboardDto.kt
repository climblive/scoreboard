package se.scoreboard.dto

data class ScoreboardDto (val contestId: Int, val raffle: RaffleWinnerListDto?, val scores: List<ScoreboardListDto>)
