package se.scoreboard.configuration

import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint
import org.springframework.stereotype.Component
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Component
class MyBasicAuthenticationEntryPoint: BasicAuthenticationEntryPoint() {

    override fun commence(request: HttpServletRequest?, response: HttpServletResponse?, authException: AuthenticationException?) {
        response!!.status = HttpServletResponse.SC_UNAUTHORIZED
        val writer = response.writer
        writer.println("HTTP Status 401 - " + authException!!.message)
    }

    @Override
    override fun afterPropertiesSet() {
        setRealmName("Baeldung");
        super.afterPropertiesSet();
    }
}