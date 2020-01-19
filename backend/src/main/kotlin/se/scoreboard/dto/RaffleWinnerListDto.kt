package se.scoreboard.dto

import se.scoreboard.dto.scoreboard.RaffleWinnerPushItemDto

data class RaffleWinnerListDto (val raffle: RaffleDto, val winners : List<RaffleWinnerPushItemDto>)
