package se.scoreboard.dto

data class ContenderDataDTO (
        val code: String,
        val name : String?,
        val compClass : String?,
        val problems : List <ContenderProblemDTO>
        )
