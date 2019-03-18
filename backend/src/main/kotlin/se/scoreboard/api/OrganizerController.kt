package se.scoreboard.api

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ContestDto
import se.scoreboard.dto.OrganizerDto
import se.scoreboard.dto.UserDto
import se.scoreboard.mapper.ContestMapper
import se.scoreboard.mapper.UserMapper
import se.scoreboard.service.OrganizerService

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
    fun getOrganizers() = organizerService.findAll()

    @GetMapping("/organizer/{id}")
    fun getOrganizer(@PathVariable("id") id: Int) = organizerService.findById(id)

    @GetMapping("/organizer/{id}/contest")
    fun getOrganizerContests(@PathVariable("id") id: Int) : List<ContestDto> =
            organizerService.fetchEntity(id).contests.map { contest -> contestMapper.convertToDto(contest) }

    @GetMapping("/organizer/{id}/user")
    fun getOrganizerUsers(@PathVariable("id") id: Int) : List<UserDto> =
            organizerService.fetchEntity(id).users.map { user -> userMapper.convertToDto(user) }

    @PostMapping("/organizer")
    fun createOrganizer(@RequestBody organizer : OrganizerDto) = organizerService.create(organizer)

    @PutMapping("/organizer/{id}")
    fun updateOrganizer(
            @PathVariable("id") id: Int,
            @RequestBody organizer : OrganizerDto) = organizerService.update(id, organizer)

    @DeleteMapping("/organizer/{id}")
    fun deleteOrganizer(@PathVariable("id") id: Int) = organizerService.delete(id)
}
