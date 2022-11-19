package se.scoreboard.data.repo

import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.CompClass

@Repository
interface CompClassRepository : ScoreboardRepository<CompClass, Int> {
}