package se.scoreboard.data.repository

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Contender

@Repository
interface ContenderRepository : CrudRepository<Contender, Integer> {
    fun findByRegistrationCode(registrationCode: String) : Contender?
}