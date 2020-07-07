package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.OrganizerDto
import se.scoreboard.dto.UserDto
import se.scoreboard.exception.WebException
import se.scoreboard.getUserPrincipal
import se.scoreboard.mapper.OrganizerMapper
import se.scoreboard.service.UserService
import javax.servlet.http.HttpServletRequest
import javax.transaction.Transactional


@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["User"])
class UserController @Autowired constructor(
        val userService: UserService,
        private var organizerMapper: OrganizerMapper) {

    @GetMapping("/user")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getUsers(request: HttpServletRequest, @RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = userService.search(request, pageable)

    @GetMapping("/user/{id}")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getUser(@PathVariable("id") id: Int) = userService.findById(id)

    @GetMapping("/user/me")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getCurrentUser() =
            userService.findByUsername(getUserPrincipal()?.username!!)
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
}
