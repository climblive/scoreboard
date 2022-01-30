package se.scoreboard.data.repo

import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Raffle

@Repository
interface RaffleRepository : ScoreboardRepository<Raffle, Int> {
}