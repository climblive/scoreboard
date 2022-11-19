package se.scoreboard.mapper

import org.mapstruct.*
import se.scoreboard.data.domain.*
import se.scoreboard.dto.ContenderDto
import se.scoreboard.dto.ScoringDto
import se.scoreboard.dto.TickDto
import kotlin.random.Random

@Mapper(componentModel = "spring")
abstract class ContenderMapper : AbstractMapper<Contender, ContenderDto>() {
    @Mappings(
        Mapping(source = "contest.id", target = "contestId"),
        Mapping(source = "compClass.id", target = "compClassId")
    )
    abstract override fun convertToDto(source: Contender): ContenderDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "organizer", ignore = true),
            Mapping(target = "ticks", ignore = true)
    )
    abstract override fun convertToEntity(source: ContenderDto): Contender

    @AfterMapping
    fun afterMapping(source: ContenderDto, @MappingTarget target: Contender) {
        target.compClass = source.compClassId?.let { entityManager.getReference(CompClass::class.java, it) }
    }
}
