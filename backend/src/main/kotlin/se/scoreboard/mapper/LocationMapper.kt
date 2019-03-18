package se.scoreboard.mapper

import org.mapstruct.Mapper
import se.scoreboard.data.domain.Location
import se.scoreboard.dto.LocationDto

@Mapper
interface LocationMapper : AbstractMapper<Location, LocationDto>