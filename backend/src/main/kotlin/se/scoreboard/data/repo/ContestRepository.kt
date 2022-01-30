package se.scoreboard.data.repo

import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Contest

@Repository
interface ContestRepository : ScoreboardRepository<Contest, Int> {
}