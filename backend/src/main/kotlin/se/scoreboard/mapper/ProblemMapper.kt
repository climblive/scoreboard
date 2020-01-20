package se.scoreboard.mapper

import org.mapstruct.*
import se.scoreboard.data.domain.Color
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.domain.Problem
import se.scoreboard.dto.ProblemDto

@Mapper(componentModel = "spring")
abstract class ProblemMapper : AbstractMapper<Problem, ProblemDto>() {
    @Mappings(
        Mapping(source = "color.id", target = "colorId"),
        Mapping(source = "contest.id", target = "contestId")
    )
    abstract override fun convertToDto(source: Problem): ProblemDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "ticks", ignore = true)
    )
    abstract override fun convertToEntity(source: ProblemDto): Problem

    @AfterMapping
    fun afterMapping(source: ProblemDto, @MappingTarget target: Problem) {
        target.color = entityManager.getReference(Color::class.java, source.colorId)
        target.contest = entityManager.getReference(Contest::class.java, source.contestId)
    }
}