package se.scoreboard.api

import com.google.common.net.MediaType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
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

    @GetMapping("/contest/export")
    fun export() : ResponseEntity<ByteArray> {
        val data = contenderService.export()
        val headers = HttpHeaders()
        headers.set(HttpHeaders.CONTENT_TYPE, MediaType.MICROSOFT_EXCEL.toString())
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=contest.xls")
        return ResponseEntity(data, headers, HttpStatus.OK)
    }
}
