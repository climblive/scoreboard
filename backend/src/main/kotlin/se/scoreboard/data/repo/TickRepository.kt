package se.scoreboard.data.repo

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Tick

@Repository
interface TickRepository : CrudRepository<Tick, Int> {
}