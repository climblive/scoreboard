package se.scoreboard.dto

data class ContenderProblemDTO(
        val id: Int,
        val color: String,
        val textColor : String,
        val colorName:String,
        val points : Int,
        val text :String,
        val sent : Boolean
)