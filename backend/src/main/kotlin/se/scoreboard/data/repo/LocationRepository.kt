package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Location

@Repository
interface LocationRepository : ScoreboardRepository<Location, Int> {
    @Query("SELECT l FROM Location l WHERE l.organizer.id IN :organizerIds")
    override fun findAllByOrganizerIds(@Param("organizerIds") organizerIds: List<Int>, pageable: Pageable?): Page<Location>

    @Query("SELECT l FROM Location l WHERE 1 = 0")
    override fun findAllByContenderId(contenderId: Int, pageable: Pageable?): Page<Location>
}