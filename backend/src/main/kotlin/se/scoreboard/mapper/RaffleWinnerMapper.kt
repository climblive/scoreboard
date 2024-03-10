package se.scoreboard.mapper

import org.mapstruct.*
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.Raffle
import se.scoreboard.data.domain.RaffleWinner
import se.scoreboard.dto.RaffleWinnerDto

@Mapper(componentModel = "spring")
abstract class RaffleWinnerMapper : AbstractMapper<RaffleWinner, RaffleWinnerDto>() {
    @Mappings(
        Mapping(source = "raffle.id", target = "raffleId"),
        Mapping(source = "contender.id", target = "contenderId"),
        Mapping(source = "contender.name", target = "contenderName")
    )
    abstract override fun convertToDto(source: RaffleWinner): RaffleWinnerDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "organizer", ignore = true),
    )
    abstract override fun convertToEntity(source: RaffleWinnerDto): RaffleWinner
}