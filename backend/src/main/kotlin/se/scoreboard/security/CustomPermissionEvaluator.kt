package se.scoreboard.security

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.access.PermissionEvaluator
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.stereotype.Component
import se.scoreboard.configuration.MyUserPrincipal
import se.scoreboard.dto.*
import java.io.Serializable

@Component
class CustomPermissionEvaluator @Autowired constructor(
        val ownershipDeriver: OwnershipDeriver) : PermissionEvaluator {

    private var logger = LoggerFactory.getLogger(CustomPermissionEvaluator::class.java)

    override fun hasPermission(auth: Authentication?, targetDomainObject: Any?, permission: Any): Boolean {
        if (auth == null || targetDomainObject == null || permission !is String) {
            return false
        }

        fun unroll(targetDomainObject: Any): List<Any> {
            var o: Any = targetDomainObject

            if (o is ResponseEntity<*>) {
                o = o.body
            }

            return if (o is List<*>) o as List<Any> else listOf(o)
        }

        val targetDomainObjects = unroll(targetDomainObject)

        val targetIds: List<Int> = targetDomainObjects.mapNotNull {
            when (it) {
                is ColorDto -> it.id
                is CompClassDto -> it.id
                is ContenderDto -> it.id
                is ContestDto -> it.id
                is LocationDto -> it.id
                is OrganizerDto -> it.id
                is ProblemDto -> it.id
                is SeriesDto -> it.id
                is TickDto -> it.id
                is UserDto -> it.id
                else -> null
        }}

        return if (targetDomainObjects.isEmpty()) {
            true
        } else hasPrivilege(auth, targetDomainObjects.first().javaClass.simpleName, targetIds, targetDomainObjects, permission.toString().toUpperCase())
    }

    override fun hasPermission(auth: Authentication?, targetId: Serializable, targetType: String?, permission: Any): Boolean {
        return if (auth == null || targetType == null || targetId !is Int || permission !is String) {
            false
        } else hasPrivilege(auth, targetType, listOf(targetId), emptyList(), permission.toString().toUpperCase())
    }

    private fun hasPrivilege(auth: Authentication, targetType: String, targetIds: List<Int>, dtos: List<Any>, permission: String): Boolean {
        val role: GrantedAuthority = auth.authorities.first()
        val principal: MyUserPrincipal = auth.principal as MyUserPrincipal

        val evaluation = PermissionEvaluation(ownershipDeriver,
            role,
            principal,
            targetType.removeSuffix("Dto").capitalize(),
            targetIds,
            dtos,
            permission)

        val result = evaluation.run()

        evaluation.lastError?.also { logger.info(evaluation.lastError) }

        return result
    }
}