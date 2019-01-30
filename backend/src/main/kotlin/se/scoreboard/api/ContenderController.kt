package se.scoreboard.api

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ContenderDataDTO
import se.scoreboard.dto.ScoreboardListDTO
import se.scoreboard.dto.ScoreboardListItemDTO
import se.scoreboard.mapper.ContenderDataMapper
import se.scoreboard.model.ContenderData
import se.scoreboard.model.Contest
import se.scoreboard.service.ContenderService

@RestController
@CrossOrigin
class ContenderController @Autowired constructor(
        val contenderService : ContenderService,
        val contenderDataMapper : ContenderDataMapper
) {

    @GetMapping("/contender/{code}")
    fun getContenderData(@PathVariable("code") code: String) : ContenderDataDTO {
        return contenderDataMapper.toDTO(
                contenderService.getContest(),
                code,
                contenderService.getContenderData(code))
    }

    @PostMapping("/contender/{code}")
    fun setContenderData(@PathVariable("code") code: String, @RequestBody input : ContenderDataDTO) : ContenderDataDTO {
        contenderService.setContenderData(contenderDataMapper.toModel(code, input))
        return getContenderData(code)
    }

    @GetMapping("/scoreboard")
    fun getScoreboard() : List<ScoreboardListDTO> {
        val allContenders = contenderService.getAllContenders()
        val contest = contenderService.getContest()
        return contest.compClasses.map{compClass -> ScoreboardListDTO(compClass, getContenderList(allContenders.filter{contender -> contender.compClass == compClass}, contest))}
    }

    private fun getContenderList(contenders: List<ContenderData>, contest: Contest): List<ScoreboardListItemDTO> {
        return contenders.map { ScoreboardListItemDTO(it.id, it.name, it.getScore(contest), it.getTenBestScore(contest))  }
    }
}