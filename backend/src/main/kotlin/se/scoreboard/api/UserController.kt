package se.scoreboard.api

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import se.scoreboard.data.repo.UserRepository
import se.scoreboard.dto.OrganizerDto
import se.scoreboard.dto.UserDto
import se.scoreboard.mapper.OrganizerMapper
import se.scoreboard.service.UserService
import java.util.*
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import se.scoreboard.configuration.MyPasswordEncoder
import se.scoreboard.exception.WebException
import se.scoreboard.getUserPrincipal
import javax.transaction.Transactional


@RestController
@CrossOrigin
@RequestMapping("/api")
class UserController @Autowired constructor(
        val userService: UserService,
        val userRepository: UserRepository) {

    private lateinit var organizerMapper: OrganizerMapper
    private lateinit var passwordEncoder: MyPasswordEncoder

    init {
        organizerMapper = Mappers.getMapper(OrganizerMapper::class.java)
        passwordEncoder = MyPasswordEncoder()
    }

    @GetMapping("/user")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getUsers(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = userService.search(pageable)

    @GetMapping("/user/{id}")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getUser(@PathVariable("id") id: Int) = userService.findById(id)

    @GetMapping("/user/me")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getCurrentUser() =
            userService.findByEmail(getUserPrincipal()?.username!!)
                ?: throw WebException(HttpStatus.INTERNAL_SERVER_ERROR, null)

    @GetMapping("/user/{id}/organizer")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getUserOrganizers(@PathVariable("id") id: Int) : List<OrganizerDto> =
            userService.fetchEntity(id).organizers.map { organizer -> organizerMapper.convertToDto(organizer) }

    @PostMapping("/user")
    @PreAuthorize("hasPermission(#user, 'create')")
    @Transactional
    fun createUser(@RequestBody user : UserDto) = userService.create(user)

    @PutMapping("/user/{id}")
    @PreAuthorize("hasPermission(#id, 'UserDto', 'update') && hasPermission(#user, 'update')")
    @Transactional
    fun updateUser(
            @PathVariable("id") id: Int,
            @RequestBody user : UserDto) = userService.update(id, user)

    @DeleteMapping("/user/{id}")
    @PreAuthorize("hasPermission(#id, 'UserDto', 'delete')")
    @Transactional
    fun deleteUser(@PathVariable("id") id: Int) = userService.delete(id)

    data class AuthData(val username: String, val password: String)

    @PostMapping("/user/login", produces = arrayOf("application/json"))
    @Transactional
    fun login(@RequestBody auth: AuthData) : ResponseEntity<String> {
        val user = userRepository.findByEmail(auth.username)
        if (passwordEncoder.matches(auth.password, MyPasswordEncoder.createPassword(MyPasswordEncoder.PasswordType.BCRYPT, user?.password!!))) {
            val token = Base64.getEncoder().encodeToString((auth.username + ":" + auth.password).toByteArray())
            return ResponseEntity(ObjectMapper().writeValueAsString(token), HttpStatus.OK)
        } else {
            return ResponseEntity(HttpStatus.FORBIDDEN)
        }
    }
}
