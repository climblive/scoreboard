package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Location
import se.scoreboard.data.domain.Organizer
import se.scoreboard.data.repo.LocationRepository
import se.scoreboard.dto.LocationDto
import se.scoreboard.mapper.AbstractMapper

@Service
class LocationService @Autowired constructor(
    locationRepository: LocationRepository,
    override var entityMapper: AbstractMapper<Location, LocationDto>) : AbstractDataService<Location, LocationDto, Int>(
        locationRepository) {

    override fun handleNested(entity: Location, dto: LocationDto) {
        entity.organizer = entityManager.getReference(Organizer::class.java, dto.organizerId)
    }
}