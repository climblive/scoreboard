package se.scoreboard.data.repo

import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Problem

@Repository
interface ProblemRepository : ScoreboardRepository<Problem, Int> {
}