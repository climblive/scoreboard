package se.scoreboard.security

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import se.scoreboard.data.repo.*
import se.scoreboard.dto.*

@Component
class OwnershipDeriver @Autowired constructor(
        val compClassRepository: CompClassRepository,
        val contenderRepository: ContenderRepository,
        val contestRepository: ContestRepository,
        val problemRepository: ProblemRepository,
        val tickRepository: TickRepository,
        val userRepository: UserRepository) {

    fun derive(identifierType: IdentifierType, targetType: String, targetIds: List<Int>): List<Int>? {
        return when (identifierType) {
            IdentifierType.CONTENDER -> deriveContenderIdentifiers(targetType, targetIds)
            IdentifierType.CONTEST -> deriveContestIdentifiers(targetType, targetIds)
            IdentifierType.ORGANIZER -> deriveOrganizerIdentifiers(targetType, targetIds)
        }
    }

    fun deriveInnerReferences(identifierType: IdentifierType, dtoType: String, dtos: List<Any>): List<Int>? {
        return when (identifierType) {
            IdentifierType.CONTENDER -> deriveContenderIdentifiersForInnerReferences(dtoType, dtos)
            IdentifierType.CONTEST -> deriveContestIdentifiersForInnerReferences(dtoType, dtos)
            IdentifierType.ORGANIZER -> deriveOrganizerIdentifiersForInnerReferences(dtoType, dtos)
        }
    }

    private fun deriveContestIdentifiers(type: String, targetIds: List<Int>): List<Int>? {
        return handleEmpty(targetIds) ?: when (type) {
            "Contest" -> targetIds
            else -> getRepository(type)?.deriveContestIds(targetIds)
        }
    }

    private fun deriveContenderIdentifiers(type: String, targetIds: List<Int>): List<Int>? {
        return handleEmpty(targetIds) ?: when (type) {
            "Contender" -> targetIds
            "Tick" -> tickRepository.deriveContenderIds(targetIds)
            else -> null
        }
    }

    private fun deriveContestIdentifiersForInnerReferences(type: String, dtos: List<Any>): List<Int>? {
        return handleEmpty(dtos) ?: when (type) {
            "Contender" -> flattenNullableLists(deriveContestIdentifiers("CompClass", dtos.mapNotNull { (it as ContenderDto).compClassId }), deriveContestIdentifiers("Contest", dtos.mapNotNull { (it as ContenderDto).contestId }))
            "Tick" -> deriveContestIdentifiers("Problem", dtos.mapNotNull { (it as TickDto).problemId })
            else -> null
        }
    }

    private fun deriveContenderIdentifiersForInnerReferences(type: String, dtos: List<Any>): List<Int>? {
        return handleEmpty(dtos) ?: when (type) {
            "Tick" -> dtos.mapNotNull { (it as TickDto).contenderId }
            else -> null
        }
    }

    private fun deriveOrganizerIdentifiers(type: String, targetIds: List<Int>): List<Int>? {
        return handleEmpty(targetIds) ?: when (type) {
            "Organizer" -> targetIds
            else -> getRepository(type)?.deriveOrganizerIds(targetIds)
        }
    }

    private fun deriveOrganizerIdentifiersForInnerReferences(type: String, dtos: List<Any>): List<Int>? {
        return handleEmpty(dtos) ?: when (type) {
            "CompClass" -> deriveOrganizerIdentifiers("Contest", dtos.mapNotNull { (it as CompClassDto).contestId })
            "Contender" -> flattenNullableLists(deriveOrganizerIdentifiers("Contest", dtos.mapNotNull { (it as ContenderDto).contestId }), deriveOrganizerIdentifiers("CompClass", dtos.mapNotNull { (it as ContenderDto).compClassId }))
            "Contest" -> dtos.mapNotNull { (it as ContestDto).organizerId }
            "Problem" -> deriveOrganizerIdentifiers("Contest", dtos.mapNotNull { (it as ProblemDto).contestId })
            "Tick" -> flattenNullableLists(deriveOrganizerIdentifiers("Problem", dtos.mapNotNull { (it as TickDto).problemId }), deriveOrganizerIdentifiers("Contender", dtos.mapNotNull { (it as TickDto).contenderId }))
            else -> null
        }
    }

    private fun getRepository(type: String): ScoreboardRepository<*,*>? {
        return when (type) {
            "CompClass" -> compClassRepository
            "Contender" -> contenderRepository
            "Contest" -> contestRepository
            "Problem" -> problemRepository
            "Tick" -> tickRepository
            "User" -> userRepository
            else -> null
        }
    }

    private fun <T: Any> flattenNullableLists(vararg elements: List<T>?): List<T>? {
        return if (elements.all { it != null }) {
            elements.toList().filterNotNull().flatten()
        } else null
    }

    private fun <T: Any> handleEmpty(elements: List<*>): List<T>? {
        return if (elements.isEmpty()) {
            emptyList()
        } else null
    }
}