package se.scoreboard.mapper

import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Mappings
import se.scoreboard.data.domain.Contender
import se.scoreboard.dto.ContenderDto

@Mapper
interface ContenderMapper : AbstractMapper<Contender, ContenderDto> {
    @Mappings(
        Mapping(source = "contest.id", target = "contestId"),
        Mapping(source = "compClass.id", target = "compClassId")
    )
    override fun convertToDto(source: Contender): ContenderDto
}