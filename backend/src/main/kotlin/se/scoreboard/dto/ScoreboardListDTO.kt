package se.scoreboard.dto

data class ScoreboardListDTO(val compClass: CompClassDTO, val contenders : List<ScoreboardListItemDTO>)