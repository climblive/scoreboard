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

    @Query("SELECT contender.contest.id FROM Contender contender WHERE contender.id IN :contenderIds")
    override fun deriveContestIds(@Param("contenderIds") targetIds: List<Int>): List<Int>

    @Query("SELECT contest.organizer.id FROM Contender contender JOIN contender.contest contest WHERE contender.id IN :contenderIds")
    override fun deriveOrganizerIds(@Param("contenderIds") targetIds: List<Int>): List<Int>

    fun findByRegistrationCode(registrationCode: String) : Contender?
}
