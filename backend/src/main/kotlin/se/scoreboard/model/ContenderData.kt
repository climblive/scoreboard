package se.scoreboard.model

data class ContenderData(
        val code : String,
        val name : String,
        val compClass : String,
        val sentProblems : List<Int>
);
