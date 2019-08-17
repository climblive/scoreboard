package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Tick

@Repository
interface TickRepository : ScoreboardRepository<Tick, Int> {
    @Query("SELECT t FROM Tick t JOIN t.problem p JOIN p.contest c WHERE c.organizer.id IN :organizerIds")
    override fun findAllByOrganizerIds(@Param("organizerIds") organizerIds: List<Int>, pageable: Pageable?): Page<Tick>

    @Query("SELECT t FROM Tick t JOIN t.contender c WHERE c.id = :contenderId")
    override fun findAllByContenderId(@Param("contenderId") contenderId: Int, pageable: Pageable?): Page<Tick>

    @Query("SELECT t.contender.id FROM Tick t WHERE t.id IN :tickIds")
    fun deriveContenderIds(@Param("tickIds") targetIds: List<Int>): List<Int>

    @Query("SELECT c.contest.id FROM Tick t JOIN t.contender c WHERE t.id IN :tickIds")
    override fun deriveContestIds(@Param("tickIds") targetIds: List<Int>): List<Int>

    @Query("SELECT c.organizer.id FROM Tick t JOIN t.problem p JOIN p.contest c WHERE t.id IN :tickIds")
    override fun deriveOrganizerIds(@Param("tickIds") targetIds: List<Int>): List<Int>

    @Query("SELECT t FROM Contest c JOIN c.problems p JOIN p.ticks t WHERE c.id = :contestId")
    fun findAllByContestId(@Param("contestId") contestId: Int): List<Tick>
}