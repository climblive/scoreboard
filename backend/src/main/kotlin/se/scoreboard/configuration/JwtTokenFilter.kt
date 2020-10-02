package se.scoreboard.configuration

import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.filter.GenericFilterBean
import java.io.IOException
import javax.servlet.FilterChain
import javax.servlet.ServletException
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest


class JwtTokenFilter(private val jwtTokenProvider: JwtTokenProvider) : GenericFilterBean() {

    @Throws(IOException::class, ServletException::class)
    override fun doFilter(req: ServletRequest, res: ServletResponse, filterChain: FilterChain) {
        val organizerId: Int? = (req as HttpServletRequest).getHeader("Organizer-Id")?.toInt()
        val authorization = jwtTokenProvider.resolveAuthorization(req)

        val auth: Authentication? = when (authorization?.method) {
            JwtTokenProvider.AuthMethod.BEARER -> if (jwtTokenProvider.validateToken(authorization.data)) jwtTokenProvider.getUserAuthentication(authorization.data) else null
            JwtTokenProvider.AuthMethod.REGCODE -> jwtTokenProvider.getContenderAuthentication(authorization.data)
            null -> null
        }

        auth?.let {
            SecurityContextHolder.getContext().authentication = it
            val principal = auth.principal;
            if (principal is MyUserPrincipal && organizerId != null) {
                principal.organizerIds = principal.organizerIds?.filter { it == organizerId }
            }
        }

        filterChain.doFilter(req, res)
    }
}