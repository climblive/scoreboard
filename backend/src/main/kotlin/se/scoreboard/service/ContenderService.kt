package se.scoreboard.service

import org.mapstruct.factory.Mappers
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
import se.scoreboard.mapper.ContenderMapper
import javax.transaction.Transactional
import kotlin.random.Random

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
    fun findByCode(code: String): ContenderDto {
        val contender = contenderRepository.findByRegistrationCode(code) ?: throw WebException(HttpStatus.NOT_FOUND, super.MSG_NOT_FOUND)
        return entityMapper.convertToDto(contender)
    }

    override fun handleNested(entity: Contender, dto: ContenderDto) {
        entity.contest = entityManager.getReference(Contest::class.java, dto.contestId)
        entity.compClass = if (dto.compClassId != null) compClassService.fetchEntity(dto.compClassId!!) else null
    }

    fun createContenders(contest: Contest, contenderCount: Int) :Array<ContenderDto> {
        return Array(contenderCount) {
            var contender = Contender()
            contender.contest = contest
            contender.registrationCode = createRegistrationCode(8)

            contender = entityRepository.save(contender)
            entityMapper.convertToDto(contender)
        }
    }
}
