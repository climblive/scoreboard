package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Series
import se.scoreboard.data.repo.SeriesRepository
import se.scoreboard.dto.SeriesDto
import se.scoreboard.mapper.AbstractMapper

@Service
class SeriesService @Autowired constructor(
        seriesRepository: SeriesRepository,
        override var entityMapper: AbstractMapper<Series, SeriesDto>) : AbstractDataService<Series, SeriesDto, Int>(seriesRepository)