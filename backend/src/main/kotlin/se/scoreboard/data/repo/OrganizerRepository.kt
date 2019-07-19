package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Organizer

@Repository
interface OrganizerRepository : ScoreboardRepository<Organizer, Int> {
    @Query("SELECT o FROM Organizer o WHERE o.id IN :organizerIds")
    override fun findAllByOrganizerIds(@Param("organizerIds") organizerIds: List<Int>, pageable: Pageable?): Page<Organizer>

    @Query("SELECT o FROM Organizer o WHERE 1 = 0")
    override fun findAllByContenderId(@Param("contenderId") contenderId: Int, pageable: Pageable?): Page<Organizer>

    @Query("SELECT c.id FROM Contest c WHERE 1 = 0")
    override fun deriveContestIds(targetIds: List<Int>): List<Int>

    @Query("SELECT o.id FROM Organizer o WHERE o.id IN :organizerIds")
    override fun deriveOrganizerIds(@Param("organizerIds") targetIds: List<Int>): List<Int>
}