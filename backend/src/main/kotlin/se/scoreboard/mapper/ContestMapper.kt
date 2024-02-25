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
    @Value("\${site.url.web}")
    lateinit var webUrl: String

    @Mappings(
        Mapping(source = "organizer.id", target = "organizerId"),
        Mapping(source = "series.id", target = "seriesId"),
        Mapping(target = "scoreboardUrl", ignore = true),
        Mapping(target = "timeBegin", ignore = true),
        Mapping(target = "timeEnd", ignore = true))
    abstract override fun convertToDto(source: Contest): ContestDto

    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "compClasses", ignore = true),
            Mapping(target = "contenders", ignore = true),
            Mapping(target = "problems", ignore = true),
            Mapping(target = "raffles", ignore = true)
    )
    abstract override fun convertToEntity(source: ContestDto): Contest

    @AfterMapping
    fun afterMapping(source: Contest, @MappingTarget target: ContestDto) {
        target.scoreboardUrl = "${webUrl}/scoreboard/${target.id}"
        target.timeBegin = source.compClasses.map { it.timeBegin }.filterNotNull().minOrNull()
        target.timeEnd = source.compClasses.map { it.timeEnd }.filterNotNull().maxOrNull()
    }

    @AfterMapping
    fun afterMapping(source: ContestDto, @MappingTarget target: Contest) {
        target.series = source.seriesId?.let { entityManager.getReference(Series::class.java, it) }
    }
}
