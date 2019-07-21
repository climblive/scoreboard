package se.scoreboard.configuration

import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.core.userdetails.UserDetails
import se.scoreboard.data.repo.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.InsufficientAuthenticationException
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Service
import se.scoreboard.data.repo.ContenderRepository

@Service
class MyUserDetailsService : UserDetailsService {

    @Autowired
    private val userRepository: UserRepository? = null
    @Autowired
    private val contenderRepository: ContenderRepository? = null

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository!!.findByEmail(username)

        if (user != null) {
            val role: String

            if (user.isAdmin) {
                role = "ROLE_ADMIN"
            } else {
                role = "ROLE_ORGANIZER"
            }

            val organizerIds = user.organizers.map { it.id!! }

            if (!organizerIds.isEmpty()) {
                return MyUserPrincipal(user, role, organizerIds)
            } else {
                throw InsufficientAuthenticationException("Orphaned user")
            }
        }

        val contender = contenderRepository!!.findByRegistrationCode(username)

        if (contender != null) {
            return MyUserPrincipal(contender)
        }

        throw UsernameNotFoundException(username)
    }
}