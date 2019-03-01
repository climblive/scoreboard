package se.scoreboard.mapper

import org.springframework.stereotype.Component
import se.scoreboard.dto.ContenderDataDTO
import se.scoreboard.dto.ContenderProblemDTO
import se.scoreboard.model.ContenderData
import se.scoreboard.model.Contest
import se.scoreboard.model.ProblemState

@Component
class ContenderDataMapper {
    fun toDTO(contest: Contest, code: String, contenderData: ContenderData?): ContenderDataDTO {
        var problems = contest.problems.map { p -> ContenderProblemDTO(
                p.id,
                p.color,
                p.textColor,
                p.colorName,
                p.points,
                p.text,
                when(contenderData == null) {
                    true -> ProblemState.NOT_SENT
                    false -> contenderData.getProblemState(p.id)
                })
        }
        return ContenderDataDTO(code, contenderData?.name, contenderData?.compClass, problems)
    }

    fun toModel(code: String, input: ContenderDataDTO): ContenderData {
        return ContenderData(0, code, input.name!!, input.compClass!!, input.problems.filter { it.state !== ProblemState.NOT_SENT}.map { it.id })
    }
}
