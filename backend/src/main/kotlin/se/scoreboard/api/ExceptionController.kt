package se.scoreboard.api

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import se.scoreboard.exception.WebException

@ControllerAdvice
@CrossOrigin
class ExceptionController {

    data class ExceptionEntity(val message:String?)

    @ExceptionHandler(WebException::class)
    @ResponseBody
    fun handleForbiddenException(e: WebException): ResponseEntity<ExceptionEntity> {
        return ResponseEntity(ExceptionEntity(e.message), e.httpStatus)
    }

}