package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Color

@Repository
interface ColorRepository : ScoreboardRepository<Color, Int> {
    @Query("SELECT DISTINCT c FROM Contender contender JOIN contender.contest contest JOIN contest.problems p JOIN p.color c WHERE contender.id = :contenderId")
    fun findAllByContenderId(@Param("contenderId") contenderId: Int, pageable: Pageable?): Page<Color>
}
