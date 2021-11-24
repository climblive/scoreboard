package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.RaffleWinner

@Repository
interface RaffleWinnerRepository : ScoreboardRepository<RaffleWinner, Int> {
    @Query("SELECT w FROM RaffleWinner w JOIN w.raffle r JOIN r.contest c WHERE c.organizer.id IN :organizerIds")
    override fun findAllByOrganizerIds(@Param("organizerIds") organizerIds: List<Int>, pageable: Pageable?): Page<RaffleWinner>

    @Query("SELECT w FROM RaffleWinner w WHERE 1 = 0")
    override fun findAllByContenderId(contenderId: Int, pageable: Pageable?): Page<RaffleWinner>
}