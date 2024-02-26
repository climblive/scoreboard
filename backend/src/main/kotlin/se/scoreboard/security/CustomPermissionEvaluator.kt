package se.scoreboard.security

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.access.PermissionEvaluator
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.stereotype.Component
import se.scoreboard.configuration.MyUserPrincipal
import se.scoreboard.dto.UserDto
import se.scoreboard.service.*
import java.io.Serializable

@Component
class CustomPermissionEvaluator @Autowired constructor(
    val colorService: ColorService,
    val compClassService: CompClassService,
    val contenderService: ContenderService,
    val contestService: ContestService,
    val problemService: ProblemService,
    val raffleService: RaffleService,
    val raffleWinnerService: RaffleWinnerService,
    val seriesService: SeriesService,
    val tickService: TickService,
    val userService: UserService
    ) : PermissionEvaluator {

    override fun hasPermission(auth: Authentication?, targetDomainObject: Any?, permission: Any): Boolean {
        if (auth == null || targetDomainObject == null || permission !is String) {
            return false
        }

        if (auth.authorities.contains(SimpleGrantedAuthority("ROLE_ADMIN"))) {
            return true
        }

        var body = if (targetDomainObject is ResponseEntity<*>) {
            targetDomainObject.body
        } else {
            targetDomainObject
        }

        val principal: MyUserPrincipal = auth.principal as MyUserPrincipal

        fun checkDto(body: Any?): Boolean {
            return when (body) {
                is UserDto -> auth.authorities.contains(SimpleGrantedAuthority("ROLE_ORGANIZER")) && body.username == principal.username
                else -> false
            }
        }

        if (body is List<*>) {
            return body.all { checkDto(it) }
        } else {
            return checkDto(body)
        }
    }

    override fun hasPermission(auth: Authentication?, targetId: Serializable, targetType: String?, permission: Any): Boolean {
        if (auth == null || targetType !is String || targetId !is Int || permission !is String) {
            return false
        }

        if (auth.authorities.contains(SimpleGrantedAuthority("ROLE_ADMIN"))) {
            return true
        }

        val principal: MyUserPrincipal = auth.principal as MyUserPrincipal

        fun checkOrganizer(organizerId: Int?): Boolean {
            if (organizerId == null) {
                return false;
            }

            return principal.organizerIds?.contains(organizerId) ?: false
        }

        fun checkContender(contenderId: Int?): Boolean {
            if (contenderId == null) {
                return false
            }

            return principal.contenderId == contenderId
        }

        fun checkContest(contestId: Int?): Boolean {
            if (contestId == null) {
                return false
            }

            return principal.contestId == contestId
        }

        if (auth.authorities.contains(SimpleGrantedAuthority("ROLE_CONTENDER"))) {
            return when (targetType) {
                "Contender" -> permission in arrayOf("read", "write") && checkContender(targetId)
                "Contest" -> permission == "read" && checkContest(targetId)
                "Tick" -> checkContender(tickService.fetchEntity(targetId).contender?.id)
                else -> false
            }
        } else {
            return when (targetType) {
                "Color" -> checkOrganizer(colorService.fetchEntity(targetId).organizer?.id)
                "CompClass" -> checkOrganizer(compClassService.fetchEntity(targetId).organizer?.id)
                "Contender" -> checkOrganizer(contenderService.fetchEntity(targetId).organizer?.id)
                "Contest" -> checkOrganizer(contestService.fetchEntity(targetId).organizer?.id)
                "Organizer" -> checkOrganizer(targetId)
                "Problem" -> checkOrganizer(problemService.fetchEntity(targetId).organizer?.id)
                "Raffle" -> checkOrganizer(raffleService.fetchEntity(targetId).organizer?.id)
                "RaffleWinner" -> checkOrganizer(raffleWinnerService.fetchEntity(targetId).organizer?.id)
                "Series" -> checkOrganizer(seriesService.fetchEntity(targetId).organizer?.id)
                "Tick" -> checkOrganizer(tickService.fetchEntity(targetId).organizer?.id)
                "User" -> userService.fetchEntity(targetId).username == principal.username
                else -> false
            }
        }
    }
}