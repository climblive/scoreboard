package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Location

@Repository
interface LocationRepository : ScoreboardRepository<Location, Int> {
    @Query("SELECT l FROM Location l")
    override fun findAllByOrganizerIds(organizerIds: List<Int>, pageable: Pageable?): Page<Location>

    @Query("SELECT l FROM Location l")
    override fun findAllByContenderId(contenderId: Int, pageable: Pageable?): Page<Location>

    @Query("SELECT c.id FROM Contest c WHERE 1 = 0")
    override fun deriveContestIds(targetIds: List<Int>): List<Int>

    @Query("SELECT o.id FROM Organizer o WHERE 1 = 0")
    override fun deriveOrganizerIds(targetIds: List<Int>): List<Int>
}