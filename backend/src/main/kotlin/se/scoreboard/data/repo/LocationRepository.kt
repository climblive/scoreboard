package se.scoreboard.data.repo

import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Location

@Repository
interface LocationRepository : ScoreboardRepository<Location, Int> {
}