package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ContestDto
import se.scoreboard.dto.LocationDto
import se.scoreboard.mapper.ContestMapper
import se.scoreboard.mapper.LocationMapper
import se.scoreboard.service.LocationService
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Locations"])
class LocationController @Autowired constructor(
        val locationService: LocationService,
        private var contestMapper: ContestMapper,
        private val locationMapper: LocationMapper) {

    @GetMapping("/locations/{id}")
    @PreAuthorize("hasPermission(#id, 'Location', 'read')")
    @Transactional
    fun getLocation(@PathVariable("id") id: Int) = locationService.findById(id)

    @GetMapping("/locations/{id}/contests")
    @PreAuthorize("hasPermission(#id, 'Location', 'read')")
    @Transactional
    fun getLocationContests(@PathVariable("id") id: Int) : List<ContestDto> =
            locationService.fetchEntity(id).contests.map { contest -> contestMapper.convertToDto(contest) }

    @PutMapping("/locations/{id}")
    @PreAuthorize("hasPermission(#id, 'Location', 'write')")
    @Transactional
    fun updateLocation(
            @PathVariable("id") id: Int,
            @RequestBody location: LocationDto): ResponseEntity<LocationDto> {
        val old = locationService.fetchEntity(id)

        val entity = locationMapper.convertToEntity(location)
        entity.organizer = old.organizer

        return locationService.update(id, entity)
    }

    @DeleteMapping("/locations/{id}")
    @PreAuthorize("hasPermission(#id, 'Location', 'delete')")
    @Transactional
    fun deleteLocation(@PathVariable("id") id: Int) = locationService.delete(id)
}
