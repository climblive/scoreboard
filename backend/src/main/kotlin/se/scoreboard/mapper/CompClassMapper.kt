package se.scoreboard.mapper

import org.mapstruct.InheritInverseConfiguration
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Mappings
import se.scoreboard.data.domain.CompClass
import se.scoreboard.dto.CompClassDto

@Mapper(componentModel = "spring")
abstract class CompClassMapper : AbstractMapper<CompClass, CompClassDto> {
    @Mappings(
        Mapping(source = "contest.id", target = "contestId")
    )
    abstract override fun convertToDto(source: CompClass): CompClassDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
        Mapping(target = "contenders", ignore = true)
    )
    abstract override fun convertToEntity(source: CompClassDto): CompClass
}