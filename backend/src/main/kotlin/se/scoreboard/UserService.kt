package se.scoreboard

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.model.Problem

@Service
class UserService @Autowired constructor(private val dataStorage: DataStorage) {

    fun getProblems() :List<Problem> = dataStorage.getContest().problems;
}