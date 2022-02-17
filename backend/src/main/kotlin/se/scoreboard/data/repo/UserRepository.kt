package se.scoreboard.data.repo

import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.User

@Repository
interface UserRepository : ScoreboardRepository<User, Int> {
    fun findByUsername(username : String) : User?
}