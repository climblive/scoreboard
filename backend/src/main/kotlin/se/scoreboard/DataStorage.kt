package se.scoreboard

import se.scoreboard.model.Contest

interface DataStorage {
    fun getContest() : Contest
}