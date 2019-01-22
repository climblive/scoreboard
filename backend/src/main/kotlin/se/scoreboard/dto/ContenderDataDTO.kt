package se.scoreboard.dto

data class ContenderDataDTO (
        val name : String,
        val compClass : String,
        val problems : List <ContenderProblemDTO>
        )
