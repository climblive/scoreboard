package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Contest

@Repository
interface ContestRepository : ScoreboardRepository<Contest, Int> {
    @Query("SELECT c FROM Contest c WHERE c.organizer.id IN :organizerIds")
    override fun findAllByOrganizerIds(@Param("organizerIds") organizerIds: List<Int>, pageable: Pageable?): Page<Contest>

    @Query("SELECT contest FROM Contender contender JOIN contender.contest contest WHERE contender.id = :contenderId")
    override fun findAllByContenderId(@Param("contenderId") contenderId: Int, pageable: Pageable?): Page<Contest>

    @Query("SELECT c.id FROM Contest c WHERE c.id IN :contestIds")
    override fun deriveContestIds(@Param("contestIds") targetIds: List<Int>): List<Int>

    @Query("SELECT c.organizer.id FROM Contest c WHERE c.id IN :contestIds")
    override fun deriveOrganizerIds(@Param("contestIds") targetIds: List<Int>): List<Int>
}