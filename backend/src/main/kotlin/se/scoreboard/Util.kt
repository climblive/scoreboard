package se.scoreboard

import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import se.scoreboard.configuration.MyUserPrincipal
import java.time.OffsetDateTime
import kotlin.random.Random

fun userHasRole(role: String) : Boolean {
    val authentication = SecurityContextHolder.getContext().getAuthentication()
    if (authentication != null) {
        return authentication.authorities.contains(SimpleGrantedAuthority("ROLE_" + role))
    } else {
        return false
    }
}

fun getUserPrincipal() : MyUserPrincipal? {
    val authentication = SecurityContextHolder.getContext().getAuthentication()
    if (authentication != null) {
        return authentication.principal as MyUserPrincipal
    } else {
        return null
    }
}

fun createRegistrationCode(length: Int): String {
    val validChars = "ACEFGHJKLMNPQRSTXY345679"

    var code = String()
    repeat(length) {
        code += validChars[Random.nextInt(validChars.length)]
    }

    return code
}

fun nowWithoutNanos() = OffsetDateTime.now().withNano(0)

