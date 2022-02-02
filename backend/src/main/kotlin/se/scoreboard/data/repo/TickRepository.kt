package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Tick

@Repository
interface TickRepository : ScoreboardRepository<Tick, Int> {
    @Query("SELECT t FROM Contest c JOIN c.problems p JOIN p.ticks t WHERE c.id = :contestId")
    fun findAllByContestId(@Param("contestId") contestId: Int): List<Tick>
}