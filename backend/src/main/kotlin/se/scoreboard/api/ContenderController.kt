package se.scoreboard.api

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ContenderDataDTO
import se.scoreboard.mapper.ContenderDataMapper
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
}