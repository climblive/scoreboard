package se.scoreboard.api

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import se.scoreboard.service.GeneratorService
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
class AdminController @Autowired constructor(
        val generatorService: GeneratorService) {

    @GetMapping("/admin/generate")
    @Transactional
    fun generateContest() {
        generatorService.generateContest()
    }
}
