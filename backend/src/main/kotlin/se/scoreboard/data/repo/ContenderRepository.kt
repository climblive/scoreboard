package se.scoreboard.data.repo

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Contender

@Repository
interface ContenderRepository : CrudRepository<Contender, Int> {
    fun findByRegistrationCode(registrationCode: String) : Contender?
}