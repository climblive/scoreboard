package se.scoreboard.mapper

import org.mapstruct.InheritInverseConfiguration
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Mappings
import se.scoreboard.data.domain.RaffleWinner
import se.scoreboard.dto.RaffleWinnerDto

@Mapper(componentModel = "spring")
abstract class RaffleWinnerMapper : AbstractMapper<RaffleWinner, RaffleWinnerDto> {
    @Mappings(
        Mapping(source = "raffle.id", target = "raffleId"),
        Mapping(source = "contender.id", target = "contenderId")
    )
    abstract override fun convertToDto(source: RaffleWinner): RaffleWinnerDto

    @InheritInverseConfiguration(name = "convertToDto")
    abstract override fun convertToEntity(source: RaffleWinnerDto): RaffleWinner
}