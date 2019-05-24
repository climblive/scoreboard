package se.scoreboard.configuration

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.User


class MyUserPrincipal(private val username: String, private val password: String, private val role: String) : UserDetails {

    constructor(user: User, role: String) : this(user.name!!, MyPasswordEncoder.createPassword(MyPasswordEncoder.BCRYPT, user.password!!), role)

    constructor(contender: Contender) : this(contender.registrationCode!!, MyPasswordEncoder.createPassword(MyPasswordEncoder.REGCODE, contender.registrationCode!!), "ROLE_CONTENDER")

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

    override fun getPassword(): String {
        return password
    }

    override fun isAccountNonExpired(): Boolean {
        return true
    }

    override fun isAccountNonLocked(): Boolean {
        return true
    }
}