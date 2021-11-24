package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Problem

@Repository
interface ProblemRepository : ScoreboardRepository<Problem, Int> {
    @Query("SELECT p FROM Problem p JOIN p.contest c WHERE c.organizer.id IN :organizerIds")
    override fun findAllByOrganizerIds(@Param("organizerIds") organizerIds: List<Int>, pageable: Pageable?): Page<Problem>

    @Query("SELECT p FROM Contender contender JOIN contender.contest contest JOIN contest.problems p WHERE contender.id = :contenderId")
    override fun findAllByContenderId(@Param("contenderId") contenderId: Int, pageable: Pageable?): Page<Problem>
}