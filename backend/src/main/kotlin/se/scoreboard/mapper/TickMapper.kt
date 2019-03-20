package se.scoreboard.mapper

import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Mappings
import se.scoreboard.data.domain.Tick
import se.scoreboard.dto.TickDto

@Mapper
interface TickMapper : AbstractMapper<Tick, TickDto> {
    @Mappings(
        Mapping(source = "contender.id", target = "contenderId"),
        Mapping(source = "problem.id", target = "problemId")
    )
    override fun convertToDto(source: Tick): TickDto
}