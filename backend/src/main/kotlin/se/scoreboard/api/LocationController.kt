package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ContestDto
import se.scoreboard.dto.LocationDto
import se.scoreboard.mapper.ContestMapper
import se.scoreboard.mapper.LocationMapper
import se.scoreboard.service.LocationService
import javax.servlet.http.HttpServletRequest
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Location"])
class LocationController @Autowired constructor(
        val locationService: LocationService,
        private var contestMapper: ContestMapper,
        private val locationMapper: LocationMapper) {

    @GetMapping("/location")
    @Transactional
    fun getLocations(request: HttpServletRequest, @RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = locationService.search(request, pageable)

    @GetMapping("/location/{id}")
    @PreAuthorize("hasPermission(#id, 'Location', 'read')")
    @Transactional
    fun getLocation(@PathVariable("id") id: Int) = locationService.findById(id)

    @GetMapping("/location/{id}/contest")
    @PreAuthorize("hasPermission(#id, 'Location', 'read')")
    @Transactional
    fun getLocationContests(@PathVariable("id") id: Int) : List<ContestDto> =
            locationService.fetchEntity(id).contests.map { contest -> contestMapper.convertToDto(contest) }

    @PostMapping("/location")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_ORGANIZER')")
    @Transactional
    fun createLocation(@RequestBody location : LocationDto) = locationService.create(locationMapper.convertToEntity(location))

    @PutMapping("/location/{id}")
    @PreAuthorize("hasPermission(#id, 'Location', 'update')")
    @Transactional
    fun updateLocation(
            @PathVariable("id") id: Int,
            @RequestBody location : LocationDto) = locationService.update(id, locationMapper.convertToEntity(location))

    @DeleteMapping("/location/{id}")
    @PreAuthorize("hasPermission(#id, 'Location', 'write')")
    @Transactional
    fun deleteLocation(@PathVariable("id") id: Int) = locationService.delete(id)
}
