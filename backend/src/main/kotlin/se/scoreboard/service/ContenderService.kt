package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import se.scoreboard.Messages
import se.scoreboard.createRegistrationCode
import se.scoreboard.data.domain.CompClass
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.domain.extension.allowedToAlterContender
import se.scoreboard.data.repo.ContenderRepository
import se.scoreboard.dto.ContenderDto
import se.scoreboard.exception.WebException
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.nowWithoutNanos
import java.time.OffsetDateTime
import java.time.ZoneOffset
import javax.transaction.Transactional

@Service
class ContenderService @Autowired constructor(
    private var contenderRepository: ContenderRepository,
    private val broadcastService: BroadcastService,
    override var entityMapper: AbstractMapper<Contender, ContenderDto>) : AbstractDataService<Contender, ContenderDto, Int>(
        contenderRepository) {

    companion object {
        private val MAX_CONTEST_CONTENDERS = 500
    }

    init {
        addConstraints(ContenderDto::contestId.name, ContenderDto::contestId, null, AttributeConstraintType.IMMUTABLE)
        addConstraints(ContenderDto::registrationCode.name, ContenderDto::registrationCode, null, AttributeConstraintType.IMMUTABLE)
        addConstraints(ContenderDto::name.name, ContenderDto::name, null, AttributeConstraintType.NON_ERASABLE)
        addConstraints(ContenderDto::compClassId.name, ContenderDto::compClassId, null, AttributeConstraintType.NON_ERASABLE)
        addConstraints(ContenderDto::entered.name, { contender: ContenderDto? -> contender?.entered?.withOffsetSameInstant(ZoneOffset.UTC) }, null, AttributeConstraintType.IMMUTABLE)
        addConstraints(ContenderDto::disqualified.name, ContenderDto::disqualified, "ROLE_CONTENDER", AttributeConstraintType.IMMUTABLE)
        addConstraints(ContenderDto::finalPlacing.name, ContenderDto::finalPlacing, "ROLE_CONTENDER", AttributeConstraintType.IMMUTABLE)
    }

    @Transactional
    fun findByCode(code: String): ContenderDto {
        val contender = contenderRepository.findByRegistrationCode(code) ?: throw WebException(HttpStatus.NOT_FOUND, super.MSG_NOT_FOUND)
        return entityMapper.convertToDto(contender)
    }

    override fun fetchEntity(id: Int) : Contender {
        return contenderRepository.getFullyJoined(id) ?: throw WebException(HttpStatus.NOT_FOUND, MSG_NOT_FOUND)
    }

    override fun onCreate(phase: Phase, new: Contender) {
        when (phase) {
            Phase.BEFORE -> {
                checkMaximumContenderLimit(new.contest?.id!!, 1)
                beforeCreateAndUpdate(null, new)
            }
            else -> {}
        }
    }

    override fun onUpdate(phase: Phase, old: Contender, new: Contender) {
        when (phase) {
            Phase.BEFORE -> {
                old.compClass?.let { checkTimeAllowed(it) }

                if (old.contest?.id != new.contest?.id) {
                    checkMaximumContenderLimit(new.contest?.id!!, 1)
                }

                beforeCreateAndUpdate(old, new)
            }
            Phase.AFTER -> {
                broadcastService.broadcast(new)
            }
        }
    }

    private fun beforeCreateAndUpdate(old: Contender?, new: Contender) {
        if (new.name != null && new.compClass != null && old?.entered == null) {
            new.entered = nowWithoutNanos()
        }
    }

    fun createContenders(contest: Contest, contenderCount: Int) :Array<ContenderDto> {
        checkMaximumContenderLimit(contest.id!!, contenderCount)

        return Array(contenderCount) {
            var contender = Contender()
            contender.organizer = contest.organizer
            contender.contest = contest
            contender.registrationCode = createRegistrationCode(8)

            contender = entityRepository.save(contender)
            entityMapper.convertToDto(contender)
        }
    }

    private fun checkMaximumContenderLimit(contestId: Int, delta: Int = 0) {
        if (contenderRepository.countByContestId(contestId) + delta > MAX_CONTEST_CONTENDERS) {
            throw WebException(HttpStatus.FORBIDDEN, Messages.CONTENDER_LIMIT_EXCEEDED)
        }
    }

    private fun checkTimeAllowed(compClass: CompClass) {
        if (!compClass.allowedToAlterContender()) {
            throw WebException(HttpStatus.FORBIDDEN, Messages.CONTEST_NOT_IN_PROGRESS)
        }
    }
}
