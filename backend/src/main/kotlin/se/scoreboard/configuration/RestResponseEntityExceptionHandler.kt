package se.scoreboard.configuration

import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.context.request.ServletWebRequest
import org.springframework.web.context.request.WebRequest
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import se.scoreboard.exception.WebException
import java.time.OffsetDateTime

@ControllerAdvice
class RestResponseEntityExceptionHandler : ResponseEntityExceptionHandler() {

    data class WebError(
            var timestamp: OffsetDateTime,
            var status: Int,
            var error: String,
            var message: String?,
            var path: String?)

    @ExceptionHandler(value = [WebException::class])
    fun handleWebException(ex: WebException, request: WebRequest): ResponseEntity<Any> {
        return handleExceptionInternal(
                ex,
                WebError(OffsetDateTime.now(),
                    ex.httpStatus.value(),
                    ex.httpStatus.reasonPhrase,
                    ex.message,
                    (request as ServletWebRequest).request.requestURI),
                HttpHeaders(),
                ex.httpStatus, request)
    }
}