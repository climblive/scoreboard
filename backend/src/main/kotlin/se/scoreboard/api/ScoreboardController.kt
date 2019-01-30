package se.scoreboard.api

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.CrossOrigin
import se.scoreboard.service.ContenderService

@Controller
@CrossOrigin
class GreetingController @Autowired constructor(contenderService : ContenderService) {


    /*@MessageMapping("/hello")
    @SendTo("/topic/greetings")
    @Throws(Exception::class)
    fun greeting(message: HelloMessage): Greeting {
        Thread.sleep(1000) // simulated delay
        return Greeting("Hello, " + HtmlUtils.htmlEscape(message.name) + "!")
    }*/

    @MessageMapping("/hello")
    @Throws(Exception::class)
    fun greeting(message: HelloMessage) {
        println("greeting " + message)
    }

}

data class HelloMessage(val name:String)

data class Greeting(val message:String)

