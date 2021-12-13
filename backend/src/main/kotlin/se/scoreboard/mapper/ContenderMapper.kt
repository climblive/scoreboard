package se.scoreboard.mapper

import org.mapstruct.*
import se.scoreboard.data.domain.CompClass
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.domain.Organizer
import se.scoreboard.dto.ContenderDto
import se.scoreboard.dto.ScoringDto
import kotlin.random.Random

@Mapper(componentModel = "spring")
abstract class ContenderMapper : AbstractMapper<Contender, ContenderDto>() {
    @Mappings(
        Mapping(source = "contest.id", target = "contestId"),
        Mapping(source = "compClass.id", target = "compClassId")
    )
    abstract override fun convertToDto(source: Contender): ContenderDto

    @AfterMapping
    fun afterMapping(source: ContenderDto, @MappingTarget target: Contender) {
        target.contest = entityManager.getReference(Contest::class.java, source.contestId)
        target.compClass = source.compClassId?.let { entityManager.getReference(CompClass::class.java, it) }
        //target.organizer = entityManager.getReference(Organizer::class.java, 1)
    }
}
