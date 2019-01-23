package se.scoreboard

import org.springframework.web.servlet.HandlerInterceptor
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpServletRequest
import org.springframework.web.servlet.ModelAndView

class DisableCacheInterceptor : HandlerInterceptor {

    @Throws(Exception::class)
    override fun afterCompletion(arg0: HttpServletRequest, arg1: HttpServletResponse, arg2: Any, arg3: Exception) {
        // No implementation
    }

    @Throws(Exception::class)
    override fun postHandle(arg0: HttpServletRequest, response: HttpServletResponse, arg2: Any, arg3: ModelAndView) {
        // No implementation
    }

    @Throws(Exception::class)
    override fun preHandle(arg0: HttpServletRequest, response: HttpServletResponse, arg2: Any): Boolean {
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
        response.setHeader("Pragma", "no-cache")
        response.setHeader("Expires", "0")
        return true
    }

}
