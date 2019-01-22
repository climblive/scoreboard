package se.scoreboard.mapper

import org.springframework.stereotype.Component
import se.scoreboard.dto.ContenderDataDTO
import se.scoreboard.model.ContenderData
import se.scoreboard.model.Contest

@Component
class ContenderDataMapper {
    fun toDTO(contest: Contest, contenderData: ContenderData?): ContenderDataDTO {
        TODO("Implement")
        return ContenderDataDTO()
    }
}
