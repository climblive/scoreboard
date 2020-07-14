package se.scoreboard.mapper

import org.mapstruct.*
import org.springframework.beans.factory.annotation.Autowired
import se.scoreboard.data.domain.CompClass
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.Contest
import se.scoreboard.dto.ContenderDto
import se.scoreboard.engine.ScoringEngine

@Mapper(componentModel = "spring")
abstract class ContenderMapper : AbstractMapper<Contender, ContenderDto>() {
    @Autowired
    private lateinit var scoringEngine: ScoringEngine

    @Mappings(
        Mapping(source = "contest.id", target = "contestId"),
        Mapping(source = "compClass.id", target = "compClassId")
    )
    abstract override fun convertToDto(source: Contender): ContenderDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "ticks", ignore = true)
    )
    abstract override fun convertToEntity(source: ContenderDto): Contender

    @AfterMapping
    fun afterMapping(source: ContenderDto, @MappingTarget target: Contender) {
        target.contest = entityManager.getReference(Contest::class.java, source.contestId)
        target.compClass = source.compClassId?.let { entityManager.getReference(CompClass::class.java, it) }
    }

    @AfterMapping
    fun afterMapping(source: Contender, @MappingTarget target: ContenderDto) {
        target.scorings = scoringEngine.getScorings(source.id!!)
    }
}
