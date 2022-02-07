package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.*
import se.scoreboard.mapper.*
import se.scoreboard.service.*
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Organizer"])
class OrganizerController @Autowired constructor(
    val organizerService: OrganizerService,
    private val seriesService: SeriesService,
    private var contestMapper: ContestMapper,
    private var colorMapper: ColorMapper,
    private var locationMapper: LocationMapper,
    private var seriesMapper: SeriesMapper,
    private var userMapper: UserMapper,
    private val organizerMapper: OrganizerMapper,
    private val colorService: ColorService,
    private val contestService: ContestService,
    private val locationService: LocationService) {

    @GetMapping("/organizer/{id}")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'read')")
    @Transactional
    fun getOrganizer(@PathVariable("id") id: Int) = organizerService.findById(id)

    @GetMapping("/organizer/{id}/contest")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'read')")
    @Transactional
    fun getOrganizerContests(@PathVariable("id") id: Int) : List<ContestDto> =
            organizerService.fetchEntity(id).contests.map { contest -> contestMapper.convertToDto(contest) }

    @PostMapping("/organizer/{id}/contest")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'write')")
    @Transactional
    fun createContest(@PathVariable("id") id: Int, @RequestBody contest : ContestDto): ResponseEntity<ContestDto> {
        val organizer = organizerService.fetchEntity(id)

        val entity = contestMapper.convertToEntity(contest)
        entity.organizer = organizer

        return contestService.create(entity)
    }

    @GetMapping("/organizer/{id}/color")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'read')")
    @Transactional
    fun getOrganizerColors(@PathVariable("id") id: Int) = colorService.findAllByOrganizerId(id)

    @PostMapping("/organizer/{id}/color")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'write')")
    @Transactional
    fun createColor(@PathVariable("id") id: Int, @RequestBody color : ColorDto): ResponseEntity<ColorDto> {
        val organizer = organizerService.fetchEntity(id)

        val entity = colorMapper.convertToEntity(color)
        entity.organizer = organizer

        return colorService.create(entity)
    }

    @GetMapping("/organizer/{id}/location")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'read')")
    @Transactional
    fun getOrganizerLocations(@PathVariable("id") id: Int) : List<LocationDto> =
            organizerService.fetchEntity(id).locations.map { location -> locationMapper.convertToDto(location) }

    @PostMapping("/organizer/{id}/location")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'write')")
    @Transactional
    fun createLocation(@PathVariable("id") id: Int, @RequestBody location : LocationDto): ResponseEntity<LocationDto> {
        val organizer = organizerService.fetchEntity(id)

        val entity = locationMapper.convertToEntity(location)
        entity.organizer = organizer

        return locationService.create(entity)
    }

    @GetMapping("/organizer/{id}/series")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'read')")
    @Transactional
    fun getOrganizerSeries(@PathVariable("id") id: Int) : List<SeriesDto> =
            organizerService.fetchEntity(id).series.map { series -> seriesMapper.convertToDto(series) }

    @PostMapping("/organizer/{id}/series")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'write')")
    @Transactional
    fun createSeries(@PathVariable("id") id: Int, @RequestBody series : SeriesDto): ResponseEntity<SeriesDto> {
        val organizer = organizerService.fetchEntity(id)

        val entity = seriesMapper.convertToEntity(series)
        entity.organizer = organizer

        return seriesService.create(entity)
    }

    @GetMapping("/organizer/{id}/user")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'read')")
    @Transactional
    fun getOrganizerUsers(@PathVariable("id") id: Int) : List<UserDto> =
            organizerService.fetchEntity(id).users.map { user -> userMapper.convertToDto(user) }

    @PostMapping("/organizer")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @Transactional
    fun createOrganizer(@RequestBody organizer : OrganizerDto) = organizerService.create(organizerMapper.convertToEntity(organizer))

    @PutMapping("/organizer/{id}")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'write')")
    @Transactional
    fun updateOrganizer(
            @PathVariable("id") id: Int,
            @RequestBody organizer : OrganizerDto) = organizerService.update(id, organizerService.fetchEntity(id))

    @DeleteMapping("/organizer/{id}")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'delete')")
    @Transactional
    fun deleteOrganizer(@PathVariable("id") id: Int) = organizerService.delete(id)
}
