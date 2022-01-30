package se.scoreboard.data.repo

import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.RaffleWinner

@Repository
interface RaffleWinnerRepository : ScoreboardRepository<RaffleWinner, Int> {
}