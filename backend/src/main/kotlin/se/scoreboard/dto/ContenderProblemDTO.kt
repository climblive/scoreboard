package se.scoreboard.dto

import se.scoreboard.model.ProblemState

data class ContenderProblemDTO(
        val id: Int,
        val color: String,
        val textColor : String,
        val colorName:String,
        val points : Int,
        val text :String,
        val state : ProblemState
)