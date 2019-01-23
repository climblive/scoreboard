package se.scoreboard.api

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ContenderDataDTO
import se.scoreboard.mapper.ContenderDataMapper
import se.scoreboard.service.ContenderService

@RestController
class ContenderController @Autowired constructor(
        val contenderService : ContenderService,
        val contenderDataMapper : ContenderDataMapper
) {

    @GetMapping("/contender/{code}")
    fun getContenderData(@PathVariable("code") code: String) =
            contenderDataMapper.toDTO(
                    contenderService.getContest(),
                    contenderService.getContenderData(code))

    @PostMapping("/contender/{code}")
    fun setContenderData(@PathVariable("code") code: String, @RequestBody input : ContenderDataDTO) =
            contenderService.setContenderData(contenderDataMapper.toModel(code, input))
}