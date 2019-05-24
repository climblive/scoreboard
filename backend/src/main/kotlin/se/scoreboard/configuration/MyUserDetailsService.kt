package se.scoreboard.configuration

import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.core.userdetails.UserDetails
import se.scoreboard.data.repo.UserRepository
import org.springframework.beans.factory.annotation.Autowired
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

            return MyUserPrincipal(user, role)
        }

        val contender = contenderRepository!!.findByRegistrationCode(username)

        if (contender != null) {
            return MyUserPrincipal(contender)
        }

        throw UsernameNotFoundException(username)
    }
}