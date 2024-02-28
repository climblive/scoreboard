package se.scoreboard.data.repo

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Problem

@Repository
interface ProblemRepository : ScoreboardRepository<Problem, Int> {
    @Query("SELECT problem FROM Problem problem WHERE problem.contest.id = :contestId")
    fun findAllByContestId(@Param("contestId") contestId: Int): List<Problem>
}
