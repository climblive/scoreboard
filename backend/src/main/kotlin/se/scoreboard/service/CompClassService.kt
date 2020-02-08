package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.CompClass
import se.scoreboard.data.repo.CompClassRepository
import se.scoreboard.dto.CompClassDto
import se.scoreboard.exception.WebException
import se.scoreboard.mapper.AbstractMapper

@Service
class CompClassService @Autowired constructor(
    compClassRepository: CompClassRepository,
    override var entityMapper: AbstractMapper<CompClass, CompClassDto>) : AbstractDataService<CompClass, CompClassDto, Int>(
        compClassRepository) {

    override fun onCreate(phase: Phase, new: CompClass) {
        when (phase) {
            Phase.BEFORE -> beforeAnyChange(new)
            else -> {}
        }
    }

    override fun onUpdate(phase: Phase, old: CompClass, new: CompClass) {
        when (phase) {
            Phase.BEFORE -> beforeAnyChange(new)
            else -> {}
        }
    }

    private fun beforeAnyChange(compClass: CompClass) {
        compClass.timeBegin = compClass.timeBegin?.withSecond(0)?.withNano(0)
        compClass.timeEnd = compClass.timeEnd?.withSecond(0)?.withNano(0)

        if (compClass.timeBegin?.isAfter(compClass.timeEnd) == true) {
            throw WebException(HttpStatus.BAD_REQUEST, "Cannot end before it has begun")
        }
    }
}
