package se.scoreboard.data.repo

import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.User

@Repository
interface UserRepository : PagingAndSortingRepository<User, Int> {
}