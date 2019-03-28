package se.scoreboard.data.repo

import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Contest

@Repository
interface ContestRepository : PagingAndSortingRepository<Contest, Int> {
}