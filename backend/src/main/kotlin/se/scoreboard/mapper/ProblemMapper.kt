package se.scoreboard.mapper

import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Mappings
import se.scoreboard.data.domain.Problem
import se.scoreboard.dto.ProblemDto

@Mapper
interface ProblemMapper : AbstractMapper<Problem, ProblemDto> {
    @Mappings(
        Mapping(source = "color.id", target = "colorId"),
        Mapping(source = "contest.id", target = "contestId")
    )
    override fun convertToDto(source: Problem): ProblemDto
}