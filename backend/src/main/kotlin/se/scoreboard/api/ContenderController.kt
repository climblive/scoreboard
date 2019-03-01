package se.scoreboard.api

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ContenderDataDTO
import se.scoreboard.dto.ProblemStateDTO
import se.scoreboard.dto.ScoreboardListDTO
import se.scoreboard.dto.ScoreboardListItemDTO
import se.scoreboard.mapper.CompClassMapper
import se.scoreboard.mapper.ContenderDataMapper
import se.scoreboard.model.ContenderData
import se.scoreboard.model.Contest
import se.scoreboard.service.ContenderService

@RestController
@CrossOrigin
@RequestMapping("/api")
class ContenderController @Autowired constructor(
        val contenderService : ContenderService,
        val contenderDataMapper : ContenderDataMapper,
        val compClassMapper: CompClassMapper
) {

    @GetMapping("/contender/{code}")
    fun getContenderData(@PathVariable("code") code: String) : ContenderDataDTO {
        if(code.startsWith("A")) {
            throw ResourceNotFoundException()
        }
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

    @PostMapping("/contender/{code}/problems/{problemId}")
    fun setProblemState(@PathVariable("code") code: String,
                        @PathVariable("problemId") problemId: Int,
                        @RequestBody input : ProblemStateDTO): ContenderDataDTO {
        println("setProblemState $code $problemId $input")
        val contenderData = contenderService.getContenderData(code)
        contenderData!!.setProblemState(problemId, input.state)
        contenderService.setContenderData(contenderData)

        return contenderDataMapper.toDTO(
                contenderService.getContest(),
                code,
                contenderData)
    }

    @GetMapping("/scoreboard")
    fun getScoreboard() : List<ScoreboardListDTO> {
        val allContenders = contenderService.getAllContenders()
        val contest = contenderService.getContest()
        return contest.compClasses.map{compClass -> ScoreboardListDTO(compClassMapper.toDTO(compClass), getContenderList(allContenders.filter{contender -> contender.compClass == compClass.name}, contest))}
    }

    private fun getContenderList(contenders: List<ContenderData>, contest: Contest): List<ScoreboardListItemDTO> {
        return contenders.map { ScoreboardListItemDTO(it.id, it.name, it.getScore(contest), it.getTenBestScore(contest))  }
    }
}
