package se.scoreboard.security

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.GrantedAuthority
import se.scoreboard.configuration.MyUserPrincipal
import se.scoreboard.dto.ColorDto

data class PermissionEvaluation @Autowired constructor(
        val ownershipDeriver: OwnershipDeriver,
        val role: GrantedAuthority,
        val principal: MyUserPrincipal,
        val targetType: String,
        val targetIds: List<Int>,
        val dtos: List<Any>,
        val permission: String,
        var lastError: String? = null) {

    fun run(): Boolean {
        return when (role.authority) {
            "ROLE_ADMIN" -> true
            "ROLE_ORGANIZER" -> checkPrivilegeForOrganizer()
            "ROLE_CONTENDER" -> checkPrivilegeForContender()
            else -> false
        }
    }

    private fun checkPrivilegeForContender(): Boolean {
        if (principal.contenderId == null || principal.contestId == null) {
            return false
        }

        fun ownsTargets(): Boolean =
                check(CheckDepth.TARGET, IdentifierType.CONTENDER, OwnershipType.UNIQUE)

        fun belongToSameContest(): Boolean =
                check(CheckDepth.TARGET, IdentifierType.CONTEST, OwnershipType.UNIQUE)

        fun referencedTargetsAccessible(): Boolean =
                check(CheckDepth.INNER_REFERENCES, IdentifierType.CONTENDER, OwnershipType.UNIQUE) && check(CheckDepth.INNER_REFERENCES, IdentifierType.CONTEST, OwnershipType.UNIQUE)

        return when (permission) {
            "READ" -> when (targetType) {
                "Contender", "Tick" -> ownsTargets()
                else -> belongToSameContest()
            }
            "UPDATE" -> when (targetType) {
                "Contender", "Tick" -> ownsTargets() && referencedTargetsAccessible()
                else -> false
            }
            else -> when (targetType) {
                "Tick" -> when (permission) {
                    "CREATE" -> referencedTargetsAccessible()
                    "DELETE" -> ownsTargets()
                    else -> false
                }
                else -> false
            }
        }
    }

    private fun checkPrivilegeForOrganizer(): Boolean {

        fun ownsTargets(): Boolean =
                check(CheckDepth.TARGET, IdentifierType.ORGANIZER, OwnershipType.UNIQUE)

        fun ownsInnerReferences(): Boolean =
                check(CheckDepth.INNER_REFERENCES, IdentifierType.ORGANIZER, OwnershipType.UNIQUE)

        if (permission in listOf("CREATE", "UPDATE") && targetType == "Color" && dtos.any { (it as ColorDto).shared }) {
            return false
        }

        return when (targetType) {
            "User" -> when (permission) {
                "READ" -> check(CheckDepth.TARGET, IdentifierType.ORGANIZER, OwnershipType.SHARED)
                else -> false
            }
            else -> when (permission) {
                "CREATE" -> ownsInnerReferences()
                "UPDATE" -> ownsTargets() && ownsInnerReferences()
                else -> ownsTargets()
            }
        }
    }

    private fun check(checkDepth: CheckDepth, identifierType: IdentifierType, ownershipType: OwnershipType): Boolean {
        val derivedIdentifiers: List<Int>? = when (checkDepth) {
            CheckDepth.TARGET ->
                if (targetIds.isEmpty()) {
                    return true
                } else ownershipDeriver.derive(identifierType, targetType, targetIds)
            CheckDepth.INNER_REFERENCES ->
                if (dtos.isEmpty()) {
                    return true
                } else ownershipDeriver.deriveInnerReferences(identifierType, targetType, dtos)
        }

        if (derivedIdentifiers?.isEmpty() ?: true) {
            return true
        }

        val principalIdentifiers: List<Int>? = when (identifierType) {
            IdentifierType.CONTEST -> principal.contestId?.let { listOf(it) }
            IdentifierType.CONTENDER -> principal.contenderId?.let { listOf(it) }
            IdentifierType.ORGANIZER -> principal.organizerIds
        }

        val result = when (ownershipType) {
            OwnershipType.SHARED -> derivedIdentifiers?.let { principalIdentifiers?.intersect(it)?.isNotEmpty() }
            OwnershipType.UNIQUE -> when (principalIdentifiers?.size) {
                1 -> derivedIdentifiers?.all { it == principalIdentifiers[0] }
                else -> derivedIdentifiers?.let { principalIdentifiers?.containsAll(it) }
            }
        } ?: false

        fun pp1(identifierType: IdentifierType): String {
            return when (identifierType) {
                IdentifierType.ORGANIZER -> "are owned by"
                else -> "belong to"
            }
        }

        fun pp2(identifierType: IdentifierType): String {
            return when (identifierType) {
                IdentifierType.CONTENDER -> "is"
                else -> "belongs to"
            }
        }

        if (!result) {
            lastError = when (checkDepth) {
                CheckDepth.TARGET -> "Requested targets"
                CheckDepth.INNER_REFERENCES -> "Inner references"
            } +
            " %s %s(s) %s".format(pp1(identifierType), identifierType, derivedIdentifiers) +
                when (ownershipType) {
                    OwnershipType.UNIQUE ->
                        " but the current principal "
                    OwnershipType.SHARED ->
                        " and do not share ownership with the current principal which "
            } +
            "%s %s(s) %s".format(pp2(identifierType), identifierType, principalIdentifiers)

        }

        return result
    }
}
