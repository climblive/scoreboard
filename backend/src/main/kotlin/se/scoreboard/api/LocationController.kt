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
import se.scoreboard.service.LocationService
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Location"])
class LocationController @Autowired constructor(
        val locationService: LocationService,
        private var contestMapper: ContestMapper) {

    @GetMapping("/location")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getLocations(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = locationService.search(pageable)

    @GetMapping("/location/{id}")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getLocation(@PathVariable("id") id: Int) = locationService.findById(id)

    @GetMapping("/location/{id}/contest")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getLocationContests(@PathVariable("id") id: Int) : List<ContestDto> =
            locationService.fetchEntity(id).contests.map { contest -> contestMapper.convertToDto(contest) }

    @PostMapping("/location")
    @PreAuthorize("hasPermission(#location, 'create')")
    @Transactional
    fun createLocation(@RequestBody location : LocationDto) = locationService.create(location)

    @PutMapping("/location/{id}")
    @PreAuthorize("hasPermission(#id, 'LocationDto', 'update') && hasPermission(#location, 'update')")
    @Transactional
    fun updateLocation(
            @PathVariable("id") id: Int,
            @RequestBody location : LocationDto) = locationService.update(id, location)

    @DeleteMapping("/location/{id}")
    @PreAuthorize("hasPermission(#id, 'LocationDto', 'delete')")
    @Transactional
    fun deleteLocation(@PathVariable("id") id: Int) = locationService.delete(id)
}
