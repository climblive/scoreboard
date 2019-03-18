package se.scoreboard.mapper

import org.mapstruct.*
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.domain.Tick
import se.scoreboard.dto.ContestDto
import se.scoreboard.dto.TickDto

@Mapper
interface TickMapper : AbstractMapper<Tick, TickDto> {
    @Mappings(
        Mapping(source = "contender.id", target = "contenderId"),
        Mapping(source = "problem.id", target = "problemId")
    )
    override fun convertToDto(source: Tick): TickDto
}