package se.scoreboard.service

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.repo.ContenderRepository
import se.scoreboard.dto.ContenderDto
import se.scoreboard.exception.NotFoundException
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.mapper.ContenderMapper
import javax.transaction.Transactional

@Service
class ContenderService @Autowired constructor(
    private var contenderRepository: ContenderRepository,
    private var compClassService: CompClassService) : AbstractDataService<Contender, ContenderDto, Int>(
        contenderRepository) {

    override lateinit var entityMapper: AbstractMapper<Contender, ContenderDto>

    init {
        entityMapper = Mappers.getMapper(ContenderMapper::class.java)
    }

    @Transactional
    open fun findByCode(code: String): ContenderDto {
        val contender = contenderRepository.findByRegistrationCode(code) ?: throw NotFoundException(super.MSG_NOT_FOUND)
        return entityMapper.convertToDto(contender)
    }

    private fun getPoints(contender: Contender) : List<Int> {
        return contender.ticks.map { tick -> tick.problem?.points }.filterNotNull()
    }

    fun getTotalScore(id: Int): Int {
        return getPoints(fetchEntity(id)).sum()
    }

    fun getQualificationScore(id: Int): Int {
        val contender = fetchEntity(id)
        val qualifyingProblems = contender.contest?.qualifyingProblems ?: return 0
        val points : List<Int> = getPoints(fetchEntity(id)).sorted()
        return points.takeLast(qualifyingProblems).sum()
    }

    override fun handleNested(entity: Contender, contender: ContenderDto) {
        entity.contest = entityManager.getReference(Contest::class.java, contender.contestId)
        entity.compClass = if (contender.compClassId != null) compClassService.fetchEntity(contender.compClassId!!) else null
    }
}