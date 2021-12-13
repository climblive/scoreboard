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
        Mapping(source = "contender.id", target = "contenderId")
    )
    abstract override fun convertToDto(source: RaffleWinner): RaffleWinnerDto

    @InheritInverseConfiguration(name = "convertToDto")
    abstract override fun convertToEntity(source: RaffleWinnerDto): RaffleWinner

    @AfterMapping
    fun afterMapping(source: RaffleWinnerDto, @MappingTarget target: RaffleWinner) {
        target.raffle = entityManager.getReference(Raffle::class.java, source.raffleId)
        target.contender = entityManager.getReference(Contender::class.java, source.contenderId)
        //target.organizer = entityManager.getReference(Organizer::class.java, 1)
    }
}