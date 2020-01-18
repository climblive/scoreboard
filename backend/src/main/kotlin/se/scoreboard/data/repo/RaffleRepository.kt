package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Raffle

@Repository
interface RaffleRepository : ScoreboardRepository<Raffle, Int> {
    @Query("SELECT r FROM Raffle r JOIN r.contest c WHERE c.organizer.id IN :organizerIds")
    override fun findAllByOrganizerIds(@Param("organizerIds") organizerIds: List<Int>, pageable: Pageable?): Page<Raffle>

    @Query("SELECT r FROM Raffle r WHERE 1 = 0")
    override fun findAllByContenderId(contenderId: Int, pageable: Pageable?): Page<Raffle>

    @Query("SELECT c.id FROM Contest c where 1 = 0")
    override fun deriveContestIds(targetIds: List<Int>): List<Int>

    @Query("SELECT c.organizer.id FROM Raffle r JOIN r.contest c WHERE r.id IN :raffleIds")
    override fun deriveOrganizerIds(@Param("raffleIds") targetIds: List<Int>): List<Int>
}