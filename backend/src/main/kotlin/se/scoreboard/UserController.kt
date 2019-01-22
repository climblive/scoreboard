package se.scoreboard

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController
import se.scoreboard.model.Greeting
import java.util.concurrent.atomic.AtomicLong

@RestController
class UserController {

    val counter = AtomicLong()

    @GetMapping("/user/{id}")
    fun greeting(@PathVariable("id") id: String) =
            Greeting(counter.incrementAndGet(), "Hello, $id")

}