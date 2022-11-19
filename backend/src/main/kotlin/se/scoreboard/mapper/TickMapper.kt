package se.scoreboard.mapper

import org.mapstruct.*
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.Problem
import se.scoreboard.data.domain.Series
import se.scoreboard.data.domain.Tick
import se.scoreboard.dto.SeriesDto
import se.scoreboard.dto.TickDto

@Mapper(componentModel = "spring")
abstract class TickMapper : AbstractMapper<Tick, TickDto>() {
    @Mappings(
        Mapping(source = "contender.id", target = "contenderId"),
        Mapping(source = "problem.id", target = "problemId")
    )
    abstract override fun convertToDto(source: Tick): TickDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "contest", ignore = true),
            Mapping(target = "organizer", ignore = true)
    )
    abstract override fun convertToEntity(source: TickDto): Tick

    @AfterMapping
    fun afterMapping(source: TickDto, @MappingTarget target: Tick) {
        target.problem = entityManager.getReference(Problem::class.java, source.problemId)
    }
}
