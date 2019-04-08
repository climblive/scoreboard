package se.scoreboard.exception

import org.springframework.http.HttpStatus
import java.lang.RuntimeException

class WebException(val httpStatus:HttpStatus, message: String?) : RuntimeException(message)