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

    @AfterMapping
    fun afterMapping(source: TickDto, @MappingTarget target: Tick) {
        target.contender = entityManager.getReference(Contender::class.java, source.contenderId)
        target.problem = entityManager.getReference(Problem::class.java, source.problemId)
        //target.organizer = entityManager.getReference(Organizer::class.java, 1)

        //entityManager.find(Contender::class.java, source.contenderId).organizer.id
    }
}