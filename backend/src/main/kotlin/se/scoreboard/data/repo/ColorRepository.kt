package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Color

@Repository
interface ColorRepository : ScoreboardRepository<Color, Int> {
    @Query("SELECT c FROM Color c")
    override fun findAllByOrganizerIds(organizerIds: List<Int>, pageable: Pageable?): Page<Color>

    @Query("SELECT c FROM Color c")
    override fun findAllByContenderId(contenderId: Int, pageable: Pageable?): Page<Color>

    @Query("SELECT c.id FROM Contest c WHERE 1 = 0")
    override fun deriveContestIds(targetIds: List<Int>): List<Int>

    @Query("SELECT o.id FROM Organizer o WHERE 1 = 0")
    override fun deriveOrganizerIds(targetIds: List<Int>): List<Int>
}