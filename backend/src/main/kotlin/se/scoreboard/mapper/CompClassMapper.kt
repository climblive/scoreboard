package se.scoreboard.mapper

import org.mapstruct.*
import se.scoreboard.data.domain.CompClass
import se.scoreboard.data.domain.Contest
import se.scoreboard.dto.CompClassDto

@Mapper(componentModel = "spring")
abstract class CompClassMapper : AbstractMapper<CompClass, CompClassDto>() {
    @Mappings(
        Mapping(source = "contest.id", target = "contestId")
    )
    abstract override fun convertToDto(source: CompClass): CompClassDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
        Mapping(target = "contenders", ignore = true)
    )
    abstract override fun convertToEntity(source: CompClassDto): CompClass

    @AfterMapping
    fun afterMapping(source: CompClassDto, @MappingTarget target: CompClass) {
        target.contest = entityManager.getReference(Contest::class.java, source.contestId)
    }
}