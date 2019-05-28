package se.scoreboard

import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder

fun userHasRole(role: String) : Boolean {
    val authentication = SecurityContextHolder.getContext().getAuthentication()
    if (authentication != null) {
        return authentication.authorities.contains(SimpleGrantedAuthority("ROLE_" + role))
    } else {
        return false
    }
}

