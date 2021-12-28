package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Contender

@Repository
interface ContenderRepository : ScoreboardRepository<Contender, Int> {
    @Query("SELECT contender FROM Contender contender JOIN contender.contest contest WHERE contest.organizer.id IN :organizerIds")
    override fun findAllByOrganizerIds(@Param("organizerIds") organizerIds: List<Int>, pageable: Pageable?): Page<Contender>

    @Query("SELECT c FROM Contender c WHERE c.id = :contenderId")
    override fun findAllByContenderId(@Param("contenderId") contenderId: Int, pageable: Pageable?): Page<Contender>

    fun findByRegistrationCode(registrationCode: String) : Contender?

    fun countByContestId(contestId: Int): Int

    @Query("SELECT c FROM Contender c JOIN FETCH c.compClass compClass JOIN FETCH c.contest contest JOIN FETCH c.ticks t JOIN FETCH t.problem p WHERE c.id = :contenderId")
    fun getFullyJoined(@Param("contenderId") contenderId: Int): Contender
}
