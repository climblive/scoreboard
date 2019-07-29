package se.scoreboard.service

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Organizer
import se.scoreboard.data.domain.Series
import se.scoreboard.data.repo.SeriesRepository
import se.scoreboard.dto.SeriesDto
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.mapper.SeriesMapper

@Service
class SeriesService @Autowired constructor(
        seriesRepository: SeriesRepository) : AbstractDataService<Series, SeriesDto, Int>(seriesRepository) {

    override lateinit var entityMapper: AbstractMapper<Series, SeriesDto>

    init {
        entityMapper = Mappers.getMapper(SeriesMapper::class.java)
    }

    override fun handleNested(entity: Series, dto: SeriesDto) {
        entity.organizer = entityManager.getReference(Organizer::class.java, dto.organizerId)
    }
}