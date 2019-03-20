package se.scoreboard.data.repo

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.CompClass

@Repository
interface CompClassRepository : CrudRepository<CompClass, Int> {
}