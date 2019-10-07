package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Color

@Repository
interface ColorRepository : ScoreboardRepository<Color, Int> {
    @Query("SELECT c FROM Color c WHERE c.organizer.id IN :organizerIds OR c.shared = 1")
    override fun findAllByOrganizerIds(@Param("organizerIds") organizerIds: List<Int>, pageable: Pageable?): Page<Color>

    @Query("SELECT DISTINCT c FROM Contender contender JOIN contender.contest contest JOIN contest.problems p JOIN p.color c WHERE contender.id = :contenderId")
    override fun findAllByContenderId(@Param("contenderId") contenderId: Int, pageable: Pageable?): Page<Color>

    @Query("SELECT c.id FROM Contest c WHERE 1 = 0")
    override fun deriveContestIds(targetIds: List<Int>): List<Int>

    @Query("SELECT c.organizer.id FROM Color c WHERE c.id IN :colorIds")
    override fun deriveOrganizerIds(@Param("colorIds") targetIds: List<Int>): List<Int>
}
