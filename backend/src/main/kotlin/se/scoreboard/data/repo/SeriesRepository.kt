package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.domain.Series

@Repository
interface SeriesRepository : ScoreboardRepository<Series, Int> {
    @Query("SELECT s FROM Series s WHERE s.organizer.id IN :organizerIds")
    override fun findAllByOrganizerIds(@Param("organizerIds") organizerIds: List<Int>, pageable: Pageable?): Page<Series>

    @Query("SELECT s FROM Contender contender JOIN contender.contest contest JOIN contest.series s WHERE contender.id = :contenderId")
    override fun findAllByContenderId(@Param("contenderId") contenderId: Int, pageable: Pageable?): Page<Series>
}