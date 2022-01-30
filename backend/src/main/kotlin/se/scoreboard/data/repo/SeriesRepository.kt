package se.scoreboard.data.repo

import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Series

@Repository
interface SeriesRepository : ScoreboardRepository<Series, Int> {
}