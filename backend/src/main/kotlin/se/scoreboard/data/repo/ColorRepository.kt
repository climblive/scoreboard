package se.scoreboard.data.repo

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Color

@Repository
interface ColorRepository : ScoreboardRepository<Color, Int> {
    @Query("SELECT DISTINCT c FROM Color c WHERE c.organizer.id = :organizerId OR c.shared = 1")
    fun findAllByOrganizerId(@Param("organizerId") organizerId: Int): List<Color>
}
