package se.scoreboard.service

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.domain.extension.getQualificationScore
import se.scoreboard.data.domain.extension.getTotalScore
import se.scoreboard.data.repo.ContenderRepository
import se.scoreboard.dto.ContenderDto
import se.scoreboard.exception.NotFoundException
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
    open fun findByCode(code: String): ContenderDto {
        val contender = contenderRepository.findByRegistrationCode(code) ?: throw NotFoundException(super.MSG_NOT_FOUND)
        return entityMapper.convertToDto(contender)
    }

    override fun handleNested(entity: Contender, dto: ContenderDto) {
        entity.contest = entityManager.getReference(Contest::class.java, dto.contestId)
        entity.compClass = if (dto.compClassId != null) compClassService.fetchEntity(dto.compClassId!!) else null
    }

    fun createContenders(contest: Contest, contenderCount: Int) :Array<ContenderDto> {
        val validChars = "ACEFGHJKLMNPQRSTXY345679"
        return Array(contenderCount) {
            // Create a code:
            var code = ""
            repeat(8) {
               code += validChars[Random.nextInt(validChars.length)]
            }
            var contender = Contender()
            contender.contest = contest
            contender.registrationCode = code

            println("save contender " + contender + " with contest " + contender.contest)
            contender = entityRepository.save(contender)
            entityMapper.convertToDto(contender)
        }
    }
}
