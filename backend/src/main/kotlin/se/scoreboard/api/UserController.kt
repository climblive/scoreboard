package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.data.repo.OrganizerRepository
import se.scoreboard.dto.OrganizerDto
import se.scoreboard.dto.UserDto
import se.scoreboard.exception.WebException
import se.scoreboard.getUserPrincipal
import se.scoreboard.mapper.OrganizerMapper
import se.scoreboard.mapper.UserMapper
import se.scoreboard.service.OrganizerService
import se.scoreboard.service.UserService
import javax.transaction.Transactional


@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Users"])
class UserController @Autowired constructor(
        private val userService: UserService,
        private val organizerRepository: OrganizerRepository,
        private var organizerMapper: OrganizerMapper,
        private val userMapper: UserMapper) {

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') || hasPermission(#id, 'User', 'read')")
    @Transactional
    fun getUser(@PathVariable("id") id: Int) = userService.findById(id)

    @GetMapping("/users/me")
    @PostAuthorize("hasRole('ROLE_ADMIN') || hasPermission(returnObject, 'read')")
    @Transactional
    fun getCurrentUser(): ResponseEntity<UserDto> {
        val user = userService.findByUsername(getUserPrincipal()?.username!!)
                   ?: throw WebException(HttpStatus.INTERNAL_SERVER_ERROR, null)

        if (user.admin) {
            user.organizers = organizerRepository.findAll().map { organizer -> organizerMapper.convertToDto(organizer) }
        }

        return ResponseEntity(user, HttpStatus.OK)
    }

    @GetMapping("/users/{id}/organizers")
    @PreAuthorize("hasRole('ROLE_ADMIN') || hasPermission(#id, 'User', 'read')")
    @Transactional
    fun getUserOrganizers(@PathVariable("id") id: Int): ResponseEntity<List<OrganizerDto>> {
        val user = userService.fetchEntity(id)
        val organizers = if (user.isAdmin) {
            organizerRepository.findAll()
        } else {
            user.organizers
        }

        return ResponseEntity(organizers.map { organizer -> organizerMapper.convertToDto(organizer) }, HttpStatus.OK)
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    fun createUser(@RequestBody user : UserDto) = userService.create(userMapper.convertToEntity(user))

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    fun updateUser(
            @PathVariable("id") id: Int,
            @RequestBody user : UserDto) = userService.update(id, userMapper.convertToEntity(user))

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    fun deleteUser(@PathVariable("id") id: Int) = userService.delete(id)
}
