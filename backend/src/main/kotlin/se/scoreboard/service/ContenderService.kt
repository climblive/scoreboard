package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import se.scoreboard.createRegistrationCode
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.repo.ContenderRepository
import se.scoreboard.dto.ContenderDto
import se.scoreboard.exception.WebException
import se.scoreboard.mapper.AbstractMapper
import java.time.OffsetDateTime
import javax.transaction.Transactional

@Service
class ContenderService @Autowired constructor(
    private var contenderRepository: ContenderRepository,
    private var compClassService: CompClassService,
    override var entityMapper: AbstractMapper<Contender, ContenderDto>) : AbstractDataService<Contender, ContenderDto, Int>(
        contenderRepository) {

    companion object {
        private val MAX_CONTEST_CONTENDERS = 500
    }

    @Transactional
    fun findByCode(code: String): ContenderDto {
        val contender = contenderRepository.findByRegistrationCode(code) ?: throw WebException(HttpStatus.NOT_FOUND, super.MSG_NOT_FOUND)
        return entityMapper.convertToDto(contender)
    }

    override fun handleNested(entity: Contender, dto: ContenderDto) {
        entity.contest = entityManager.getReference(Contest::class.java, dto.contestId)
        entity.compClass = if (dto.compClassId != null) compClassService.fetchEntity(dto.compClassId!!) else null
    }

    override fun onChange(old: Contender, new: Contender) {
        if (new.name != null && new.compClass != null && old.entered == null) {
            new.entered = OffsetDateTime.now()
        }
    }

    override fun create(contender: ContenderDto): ContenderDto {
        checkMaximumContenderLimit(contender.contestId!!, 1)
        return super.create(contender)
    }

    override fun update(id: Int, contender: ContenderDto): ContenderDto {
        val updated = super.update(id, contender)
        checkMaximumContenderLimit(updated.contestId!!, 0)
        return updated
    }

    fun createContenders(contest: Contest, contenderCount: Int) :Array<ContenderDto> {
        checkMaximumContenderLimit(contest.id!!, contenderCount)

        return Array(contenderCount) {
            var contender = Contender()
            contender.contest = contest
            contender.registrationCode = createRegistrationCode(8)

            contender = entityRepository.save(contender)
            entityMapper.convertToDto(contender)
        }
    }

    fun checkMaximumContenderLimit(contestId: Int, delta: Int = 0) {
        if (contenderRepository.countByContestId(contestId) + delta > MAX_CONTEST_CONTENDERS) {
            throw WebException(HttpStatus.FORBIDDEN, "Contender limit exceeded for the contest")
        }
    }
}
