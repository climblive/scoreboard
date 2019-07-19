package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.User

@Repository
interface UserRepository : ScoreboardRepository<User, Int> {
    @Query("SELECT u FROM User u JOIN u.organizers o WHERE o.id IN :organizerIds")
    override fun findAllByOrganizerIds(@Param("organizerIds") organizerIds: List<Int>, pageable: Pageable?): Page<User>

    @Query("SELECT u FROM User u WHERE 1 = 0")
    override fun findAllByContenderId(contenderId: Int, pageable: Pageable?): Page<User>

    @Query("SELECT c FROM Contest c WHERE 1 = 0")
    override fun deriveContestIds(targetIds: List<Int>): List<Int>

    @Query("SELECT o.id FROM User u JOIN u.organizers o WHERE u.id IN :userIds")
    override fun deriveOrganizerIds(@Param("userIds") targetIds: List<Int>): List<Int>

    fun findByEmail(username : String) : User?
}