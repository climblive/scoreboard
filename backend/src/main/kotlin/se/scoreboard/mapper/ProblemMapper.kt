package se.scoreboard.mapper

import org.mapstruct.*
import se.scoreboard.data.domain.Problem
import se.scoreboard.dto.ProblemDto

@Mapper(componentModel = "spring")
abstract class ProblemMapper : AbstractMapper<Problem, ProblemDto>() {
    @Mappings(
        Mapping(source = "contest.id", target = "contestId"),
    )
    abstract override fun convertToDto(source: Problem): ProblemDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "ticks", ignore = true),
            Mapping(target = "organizer", ignore = true)
    )
    abstract override fun convertToEntity(source: ProblemDto): Problem
}
