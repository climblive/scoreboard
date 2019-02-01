package se.scoreboard.api

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import se.scoreboard.model.Contest
import se.scoreboard.service.ContenderService

@RestController
@CrossOrigin
@RequestMapping("/api")
class ContestController @Autowired constructor(
        val contenderService : ContenderService
) {

    @GetMapping("/contest")
    fun getContest() : Contest {
        return contenderService.getContest()
    }
}
