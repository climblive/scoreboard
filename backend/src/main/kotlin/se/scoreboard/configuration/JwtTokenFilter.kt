package se.scoreboard.configuration

import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.filter.GenericFilterBean
import java.io.IOException
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.ServletRequest
import jakarta.servlet.ServletResponse
import jakarta.servlet.http.HttpServletRequest


class JwtTokenFilter(private val jwtTokenProvider: JwtTokenProvider) : GenericFilterBean() {

    @Throws(IOException::class, ServletException::class)
    override fun doFilter(req: ServletRequest, res: ServletResponse, filterChain: FilterChain) {
        val authorization = jwtTokenProvider.resolveAuthorization(req as HttpServletRequest)

        val auth: Authentication? = when (authorization?.method) {
            JwtTokenProvider.AuthMethod.BEARER -> if (jwtTokenProvider.validateToken(authorization.data)) jwtTokenProvider.getUserAuthentication(authorization.data) else null
            JwtTokenProvider.AuthMethod.REGCODE -> jwtTokenProvider.getContenderAuthentication(authorization.data)
            null -> null
        }

        auth?.let {
            SecurityContextHolder.getContext().authentication = it
        }

        filterChain.doFilter(req, res)
    }
}