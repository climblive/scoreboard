package se.scoreboard.data.repository

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Contest

@Repository
interface ContestRepository : CrudRepository<Contest, Integer> {
}