package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.*
import se.scoreboard.mapper.*
import se.scoreboard.service.*
import javax.servlet.http.HttpServletRequest
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

    @GetMapping("/organizer")
    @Transactional
    fun getOrganizers(request: HttpServletRequest, @RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = organizerService.search(request, pageable)

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
    fun createContest(@PathVariable("id") id: Int, @RequestBody contest : ContestDto) {
        val organizer = organizerService.fetchEntity(id)
        contest.organizerId = organizer.id
        contestService.create(contestMapper.convertToEntity(contest))
    }

    @GetMapping("/organizer/{id}/color")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'read')")
    @Transactional
    fun getOrganizerColors(@PathVariable("id") id: Int) : List<ColorDto> =
            organizerService.fetchEntity(id).colors.map { color -> colorMapper.convertToDto(color) }

    @PostMapping("/organizer/{id}/color")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'read')")
    @Transactional
    fun createColor(@PathVariable("id") id: Int, @RequestBody color : ColorDto) {
        val organizer = organizerService.fetchEntity(id)
        color.organizerId = organizer.id
        colorService.create(colorMapper.convertToEntity(color))
    }

    @GetMapping("/organizer/{id}/location")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'read')")
    @Transactional
    fun getOrganizerLocations(@PathVariable("id") id: Int) : List<LocationDto> =
            organizerService.fetchEntity(id).locations.map { location -> locationMapper.convertToDto(location) }

    @PostMapping("/organizer/{id}/location")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'write')")
    @Transactional
    fun createLocation(@PathVariable("id") id: Int, @RequestBody location : LocationDto) {
        val organizer = organizerService.fetchEntity(id)
        location.organizerId = organizer.id
        locationService.create(locationMapper.convertToEntity(location))
    }

    @GetMapping("/organizer/{id}/series")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'read')")
    @Transactional
    fun getOrganizerSeries(@PathVariable("id") id: Int) : List<SeriesDto> =
            organizerService.fetchEntity(id).series.map { series -> seriesMapper.convertToDto(series) }

    @PostMapping("/organizer/{id}/series")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'write')")
    @Transactional
    fun createSeries(@RequestBody series : SeriesDto) = seriesService.create(seriesMapper.convertToEntity(series))

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
            @RequestBody organizer : OrganizerDto) = organizerService.update(id, organizerMapper.convertToEntity(organizer))

    @DeleteMapping("/organizer/{id}")
    @PreAuthorize("hasPermission(#id, 'Organizer', 'delete')")
    @Transactional
    fun deleteOrganizer(@PathVariable("id") id: Int) = organizerService.delete(id)
}
