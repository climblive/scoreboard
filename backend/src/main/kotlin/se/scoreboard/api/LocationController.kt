package se.scoreboard.api

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ContestDto
import se.scoreboard.dto.LocationDto
import se.scoreboard.mapper.ContestMapper
import se.scoreboard.service.LocationService

@RestController
@CrossOrigin
@RequestMapping("/api")
class LocationController @Autowired constructor(
        val locationService: LocationService) {

    private lateinit var contestMapper: ContestMapper

    init {
        contestMapper = Mappers.getMapper(ContestMapper::class.java)
    }

    @GetMapping("/location")
    fun getLocations(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = locationService.search(filter, pageable)

    @GetMapping("/location/{id}")
    fun getLocation(@PathVariable("id") id: Int) = locationService.findById(id)

    @GetMapping("/location/{id}/contest")
    fun getLocationContests(@PathVariable("id") id: Int) : List<ContestDto> =
            locationService.fetchEntity(id).contests.map { contest -> contestMapper.convertToDto(contest) }

    @PostMapping("/location")
    fun createLocation(@RequestBody location : LocationDto) = locationService.create(location)

    @PutMapping("/location/{id}")
    fun updateLocation(
            @PathVariable("id") id: Int,
            @RequestBody location : LocationDto) = locationService.update(id, location)

    @DeleteMapping("/location/{id}")
    fun deleteLocation(@PathVariable("id") id: Int) = locationService.delete(id)
}
