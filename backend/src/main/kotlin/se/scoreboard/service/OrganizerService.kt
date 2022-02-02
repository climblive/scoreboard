package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Organizer
import se.scoreboard.data.domain.User
import se.scoreboard.data.repo.OrganizerRepository
import se.scoreboard.data.repo.UserRepository
import se.scoreboard.dto.OrganizerDto
import se.scoreboard.getUserPrincipal
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.userHasRole
import javax.servlet.http.HttpServletRequest
import javax.transaction.Transactional

@Service
class OrganizerService @Autowired constructor(
    private val organizerRepository: OrganizerRepository,
    private var userRepository: UserRepository,
    override var entityMapper: AbstractMapper<Organizer, OrganizerDto>) : AbstractDataService<Organizer, OrganizerDto, Int>(
        organizerRepository) {

    @Transactional
    fun search(request: HttpServletRequest, pageable: Pageable?) : ResponseEntity<List<OrganizerDto>> {
        var result: List<OrganizerDto>

        var headers = HttpHeaders()
        headers.set("Access-Control-Expose-Headers", "Content-Range")
        var page: Page<Organizer> = Page.empty()

        val principal = getUserPrincipal()

        if (userHasRole("ORGANIZER") || userHasRole("ADMIN")) {
            page = organizerRepository.findAllByOrganizerIds(principal?.organizerIds!!, pageable)
        }

        headers.set("Content-Range", "bytes %d-%d/%d".format(
                page.number * page.size, page.number * page.size + page.numberOfElements, page.totalElements))
        result = page.content.map { entity -> entityMapper.convertToDto(entity) }

        return ResponseEntity(result, headers, HttpStatus.OK)
    }

    override fun onCreate(phase: Phase, new: Organizer) {
        when (phase) {
            Phase.BEFORE -> {
                if (!userHasRole("CONTENDER")) {
                    val principal = getUserPrincipal()
                    val user: User? = userRepository.findByUsername(principal?.username!!)
                    user?.let { new.users.add(it) }
                }
            }
            else -> {}
        }
    }

    override fun onUpdate(phase: Phase, old: Organizer, new: Organizer) {
        when (phase) {
            Phase.BEFORE -> new.users = old.users
            else -> {}
        }
    }
}