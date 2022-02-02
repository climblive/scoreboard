package se.scoreboard.mapper

import org.mapstruct.*
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.Problem
import se.scoreboard.data.domain.Tick
import se.scoreboard.dto.TickDto

@Mapper(componentModel = "spring")
abstract class TickMapper : AbstractMapper<Tick, TickDto>() {
    @Mappings(
        Mapping(source = "contender.id", target = "contenderId"),
        Mapping(source = "problem.id", target = "problemId")
    )
    abstract override fun convertToDto(source: Tick): TickDto
}