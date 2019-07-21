package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.CompClass

@Repository
interface CompClassRepository : ScoreboardRepository<CompClass, Int> {
    @Query("SELECT cc FROM CompClass cc JOIN cc.contest c WHERE c.organizer.id IN :organizerIds")
    override fun findAllByOrganizerIds(@Param("organizerIds") organizerIds: List<Int>, pageable: Pageable?): Page<CompClass>

    @Query("SELECT cc FROM Contender contender JOIN contender.contest contest JOIN contest.compClasses cc WHERE contender.id = :contenderId")
    override fun findAllByContenderId(@Param("contenderId") contenderId: Int, pageable: Pageable?): Page<CompClass>

    @Query("SELECT cc.contest.id FROM CompClass cc WHERE cc.id IN :compClassIds")
    override fun deriveContestIds(@Param("compClassIds") targetIds: List<Int>): List<Int>

    @Query("SELECT c.organizer.id FROM CompClass cc JOIN cc.contest c WHERE cc.id IN :compClassIds")
    override fun deriveOrganizerIds(@Param("compClassIds") targetIds: List<Int>): List<Int>
}