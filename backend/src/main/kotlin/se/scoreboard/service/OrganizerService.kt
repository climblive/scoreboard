package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Organizer
import se.scoreboard.data.domain.User
import se.scoreboard.data.repo.OrganizerRepository
import se.scoreboard.data.repo.UserRepository
import se.scoreboard.dto.OrganizerDto
import se.scoreboard.getUserPrincipal
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.userHasRole

@Service
class OrganizerService @Autowired constructor(
    organizerRepository: OrganizerRepository,
    private var userRepository: UserRepository,
    override var entityMapper: AbstractMapper<Organizer, OrganizerDto>) : AbstractDataService<Organizer, OrganizerDto, Int>(
        organizerRepository) {

    override fun onCreate(phase: Phase, new: Organizer) {
        when (phase) {
            Phase.BEFORE -> {
                if (!userHasRole("CONTENDER")) {
                    val principal = getUserPrincipal()
                    val user: User? = userRepository.findByUsername(principal?.username!!)
                    user?.let { new.users.add(it) }
                }
            }
            else -> {}
        }
    }
}