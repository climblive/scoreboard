package se.scoreboard.service

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Color
import se.scoreboard.data.domain.Contest
import se.scoreboard.data.domain.Problem
import se.scoreboard.data.repo.ProblemRepository
import se.scoreboard.dto.ProblemDto
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.mapper.ProblemMapper

@Service
class ProblemService @Autowired constructor(
    problemRepository: ProblemRepository) : AbstractDataService<Problem, ProblemDto, Int>(
        problemRepository) {

    override lateinit var entityMapper: AbstractMapper<Problem, ProblemDto>

    init {
        entityMapper = Mappers.getMapper(ProblemMapper::class.java)
    }

    override fun handleNested(entity: Problem, problem: ProblemDto) {
        entity.color = entityManager.getReference(Color::class.java, problem.colorId)
        entity.contest = entityManager.getReference(Contest::class.java, problem.contestId)
    }
}