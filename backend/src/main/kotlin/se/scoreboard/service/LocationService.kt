package se.scoreboard.service

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Location
import se.scoreboard.data.domain.Organizer
import se.scoreboard.data.repo.LocationRepository
import se.scoreboard.dto.LocationDto
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.mapper.LocationMapper

@Service
class LocationService @Autowired constructor(
    locationRepository: LocationRepository) : AbstractDataService<Location, LocationDto, Int>(
        locationRepository) {

    override lateinit var entityMapper: AbstractMapper<Location, LocationDto>

    init {
        entityMapper = Mappers.getMapper(LocationMapper::class.java)
    }

    override fun handleNested(entity: Location, dto: LocationDto) {
        entity.organizer = entityManager.getReference(Organizer::class.java, dto.organizerId)
    }
}