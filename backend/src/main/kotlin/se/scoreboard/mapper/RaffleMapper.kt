package se.scoreboard.mapper

import org.mapstruct.InheritInverseConfiguration
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Mappings
import se.scoreboard.data.domain.Raffle
import se.scoreboard.dto.RaffleDto

@Mapper(componentModel = "spring")
abstract class RaffleMapper : AbstractMapper<Raffle, RaffleDto> {
    @Mappings(
        Mapping(source = "contest.id", target = "contestId")
    )
    abstract override fun convertToDto(source: Raffle): RaffleDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "winners", ignore = true)
    )
    abstract override fun convertToEntity(source: RaffleDto): Raffle
}