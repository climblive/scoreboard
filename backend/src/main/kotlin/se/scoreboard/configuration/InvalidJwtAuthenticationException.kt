package se.scoreboard.configuration

import org.springframework.security.core.AuthenticationException

class InvalidJwtAuthenticationException(e: String) : AuthenticationException(e) {
    companion object {
        private val serialVersionUID = -761503632186596342L
    }
}