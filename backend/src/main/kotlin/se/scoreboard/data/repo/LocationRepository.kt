package se.scoreboard.data.repo

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Location

@Repository
interface LocationRepository : CrudRepository<Location, Int> {
}