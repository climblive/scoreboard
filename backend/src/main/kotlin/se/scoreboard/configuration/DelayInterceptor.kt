package se.scoreboard.configuration

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.servlet.HandlerInterceptor
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Component
class DelayInterceptor constructor(
        @Value("\${dev.delay:0}")
        private var delay: Long) : HandlerInterceptor {


    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        Thread.sleep(delay)
        return true
    }
}