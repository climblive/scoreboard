package se.scoreboard.data.repo

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Tick

@Repository
interface TickRepository : ScoreboardRepository<Tick, Int> {
    @Query("SELECT t FROM Tick t WHERE t.contest.id = :contestId")
    fun findAllByContestId(@Param("contestId") contestId: Int): List<Tick>
}