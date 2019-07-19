package se.scoreboard.api

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ContestDto
import se.scoreboard.dto.OrganizerDto
import se.scoreboard.dto.UserDto
import se.scoreboard.mapper.ContestMapper
import se.scoreboard.mapper.UserMapper
import se.scoreboard.service.OrganizerService
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
class OrganizerController @Autowired constructor(
        val organizerService: OrganizerService) {

    private lateinit var contestMapper: ContestMapper
    private lateinit var userMapper: UserMapper

    init {
        contestMapper = Mappers.getMapper(ContestMapper::class.java)
        userMapper = Mappers.getMapper(UserMapper::class.java)
    }

    @GetMapping("/organizer")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getOrganizers(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = organizerService.search(pageable)

    @GetMapping("/organizer/{id}")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getOrganizer(@PathVariable("id") id: Int) = organizerService.findById(id)

    @GetMapping("/organizer/{id}/contest")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getOrganizerContests(@PathVariable("id") id: Int) : List<ContestDto> =
            organizerService.fetchEntity(id).contests.map { contest -> contestMapper.convertToDto(contest) }

    @GetMapping("/organizer/{id}/user")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getOrganizerUsers(@PathVariable("id") id: Int) : List<UserDto> =
            organizerService.fetchEntity(id).users.map { user -> userMapper.convertToDto(user) }

    @PostMapping("/organizer")
    @PreAuthorize("hasPermission(#organizer, 'create')")
    @Transactional
    fun createOrganizer(@RequestBody organizer : OrganizerDto) = organizerService.create(organizer)

    @PutMapping("/organizer/{id}")
    @PreAuthorize("hasPermission(#id, 'OrganizerDto', 'update') && hasPermission(#organizer, 'update')")
    @Transactional
    fun updateOrganizer(
            @PathVariable("id") id: Int,
            @RequestBody organizer : OrganizerDto) = organizerService.update(id, organizer)

    @DeleteMapping("/organizer/{id}")
    @PreAuthorize("hasPermission(#id, 'OrganizerDto', 'delete')")
    @Transactional
    fun deleteOrganizer(@PathVariable("id") id: Int) = organizerService.delete(id)
}
