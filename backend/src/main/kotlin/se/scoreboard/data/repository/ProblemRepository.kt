package se.scoreboard.data.repository

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Problem

@Repository
interface ProblemRepository : CrudRepository<Problem, Integer> {
}