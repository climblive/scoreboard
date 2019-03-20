package se.scoreboard.mapper

import org.mapstruct.InheritInverseConfiguration
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

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "ticks", ignore = true)
    )
    override fun convertToEntity(source: ContenderDto): Contender
}