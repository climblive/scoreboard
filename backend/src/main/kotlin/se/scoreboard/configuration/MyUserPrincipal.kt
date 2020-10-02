package se.scoreboard.configuration

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.User


class MyUserPrincipal(private val username: String, private val role: String, val contenderId: Int?, val contestId: Int?, var organizerIds: List<Int>?) : UserDetails {

    constructor(user: User, role: String, organizerIds: List<Int>) : this(
            user.username!!,
            role,
            null,
            null,
            organizerIds)

    constructor(contender: Contender) : this(
            contender.registrationCode!!,
            "ROLE_CONTENDER",
            contender.id,
            contender.contest?.id,
            null)

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return mutableSetOf(SimpleGrantedAuthority(role))
    }

    override fun isEnabled(): Boolean {
        return true
    }

    override fun getUsername(): String {
        return username
    }

    override fun isCredentialsNonExpired(): Boolean {
        return true
    }

    override fun getPassword(): String? {
        return null
    }

    override fun isAccountNonExpired(): Boolean {
        return true
    }

    override fun isAccountNonLocked(): Boolean {
        return true
    }
}