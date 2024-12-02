package se.scoreboard.data.repo

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Contender
import java.util.*

@Repository
interface ContenderRepository : ScoreboardRepository<Contender, Int> {
    fun findByRegistrationCode(registrationCode: String) : Contender?

    fun countByContestId(contestId: Int): Int

    @Query("SELECT c FROM Contender c LEFT JOIN FETCH c.compClass compClass LEFT JOIN FETCH c.contest contest LEFT JOIN FETCH c.ticks t LEFT JOIN FETCH t.problem p WHERE c.id = :contenderId")
    override fun findById(@Param("contenderId") contenderId: Int): Optional<Contender>
}
