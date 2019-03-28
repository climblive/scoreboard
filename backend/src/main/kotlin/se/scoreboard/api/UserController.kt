package se.scoreboard.api

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.OrganizerDto
import se.scoreboard.dto.UserDto
import se.scoreboard.mapper.OrganizerMapper
import se.scoreboard.service.UserService

@RestController
@CrossOrigin
@RequestMapping("/api")
class UserController @Autowired constructor(
        val userService: UserService) {

    private lateinit var organizerMapper: OrganizerMapper

    init {
        organizerMapper = Mappers.getMapper(OrganizerMapper::class.java)
    }

    @GetMapping("/user")
    fun getUsers(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = userService.search(filter, pageable)

    @GetMapping("/user/{id}")
    fun getUser(@PathVariable("id") id: Int) = userService.findById(id)

    @GetMapping("/user/{id}/organizer")
    fun getUserOrganizers(@PathVariable("id") id: Int) : List<OrganizerDto> =
            userService.fetchEntity(id).organizers.map { organizer -> organizerMapper.convertToDto(organizer) }

    @PostMapping("/user")
    fun createUser(@RequestBody user : UserDto) = userService.create(user)

    @PutMapping("/user/{id}")
    fun updateUser(
            @PathVariable("id") id: Int,
            @RequestBody user : UserDto) = userService.update(id, user)

    @DeleteMapping("/user/{id}")
    fun deleteUser(@PathVariable("id") id: Int) = userService.delete(id)
}
