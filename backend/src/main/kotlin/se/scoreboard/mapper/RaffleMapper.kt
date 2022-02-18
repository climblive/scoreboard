package se.scoreboard.mapper

import org.mapstruct.*
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.domain.Raffle
import se.scoreboard.dto.RaffleDto

@Mapper(componentModel = "spring")
abstract class RaffleMapper : AbstractMapper<Raffle, RaffleDto>() {
    @Mappings(
        Mapping(source = "contest.id", target = "contestId")
    )
    abstract override fun convertToDto(source: Raffle): RaffleDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "winners", ignore = true),
            Mapping(target = "organizer", ignore = true)
    )
    abstract override fun convertToEntity(source: RaffleDto): Raffle
}