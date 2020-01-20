package se.scoreboard.mapper

import org.mapstruct.*
import org.springframework.beans.factory.annotation.Value
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.domain.Location
import se.scoreboard.data.domain.Organizer
import se.scoreboard.data.domain.Series
import se.scoreboard.dto.ContestDto

@Mapper(componentModel = "spring")
abstract class ContestMapper : AbstractMapper<Contest, ContestDto>() {
    @Value("\${site.url}")
    lateinit var siteUrl: String

    @Mappings(
        Mapping(source = "location.id", target = "locationId"),
        Mapping(source = "organizer.id", target = "organizerId"),
        Mapping(source = "series.id", target = "seriesId"),
        Mapping(target = "scoreboardUrl", ignore = true)
    )
    abstract override fun convertToDto(source: Contest): ContestDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "compClasses", ignore = true),
            Mapping(target = "contenders", ignore = true),
            Mapping(target = "problems", ignore = true)
    )
    abstract override fun convertToEntity(source: ContestDto): Contest

    @AfterMapping
    fun afterMapping(@MappingTarget target: ContestDto) {
        target.scoreboardUrl = "${siteUrl}/scoreboard/${target.id}"
    }

    @AfterMapping
    fun afterMapping(source: ContestDto, @MappingTarget target: Contest) {
        target.location = source.locationId?.let { entityManager.getReference(Location::class.java, it) }
        target.organizer = entityManager.getReference(Organizer::class.java, source.organizerId)
        target.series = source.seriesId?.let { entityManager.getReference(Series::class.java, it) }
    }
}