package se.scoreboard.api

import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import se.scoreboard.data.repo.CompClassRepository
import se.scoreboard.data.repo.ContenderRepository
import se.scoreboard.data.repo.ContestRepository
import se.scoreboard.data.repo.TickRepository
import se.scoreboard.dto.*
import se.scoreboard.mapper.ContenderMapper
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.time.temporal.ChronoUnit

class ContenderTest : ControllerTestBase() {

    @Test
    fun getContest() {
        val contest = get<ContestDto>("/api/contest/1", HttpStatus.OK)

        assertThat(contest.id).isEqualTo(1)
        assertThat(contest.organizerId).isEqualTo(1)
        assertThat(contest.seriesId).isNull()
        assertThat(contest.name).isEqualTo("Mongo Bouldering World Championship")
        assertThat(contest.description).isNull()
        assertThat(contest.locationId).isNull()
        assertThat(contest.qualifyingProblems).isEqualTo(3)
        assertThat(contest.finalists).isEqualTo(8)
        assertThat(contest.rules).isNull()
        assertThat(contest.gracePeriod).isEqualTo(15)
    }

    @Test
    fun listColors() {
        val colors = get<List<ColorDto>>("/api/color", HttpStatus.OK)
        assertThat(colors).hasSize(3)

        val color = colors.associateBy({ it.id }, { it })[2]!!

        assertThat(color.id).isEqualTo(2)
        assertThat(color.organizerId).isEqualTo(1)
        assertThat(color.name).isEqualTo("Green")
        assertThat(color.rgbPrimary).isEqualTo("#00ff00")
        assertThat(color.rgbSecondary).isNull()
        assertThat(color.shared).isEqualTo(true)
    }

    @Test
    fun listCompClasses() {
        val compClasses = get<List<CompClassDto>>("/api/contest/1/compClass", HttpStatus.OK)
        assertThat(compClasses).hasSize(3)

        val compClass = compClasses.associateBy({ it.id }, { it })[3]!!

        assertThat(compClass.id).isEqualTo(3)
        assertThat(compClass.contestId).isEqualTo(1)
        assertThat(compClass.name).isEqualTo("Youth")
        assertThat(compClass.description).isNull()
        assertThat(compClass.timeBegin).isEqualTo(OffsetDateTime.of(2040, 1, 1, 17, 0, 0, 0, ZoneOffset.UTC))
        assertThat(compClass.timeEnd).isEqualTo(OffsetDateTime.of(2040, 1, 1, 20, 0, 0, 0, ZoneOffset.UTC))
    }

    @Test
    fun listProblems() {
        val problems = get<List<ProblemDto>>("/api/contest/1/problem", HttpStatus.OK)
        assertThat(problems).hasSize(8)

        val problem = problems.associateBy({ it.id }, { it })[8]!!

        assertThat(problem.id).isEqualTo(8)
        assertThat(problem.contestId).isEqualTo(1)
        assertThat(problem.number).isEqualTo(8)
        assertThat(problem.colorId).isEqualTo(2)
        assertThat(problem.points).isEqualTo(25)
        assertThat(problem.flashBonus).isEqualTo(6)
    }

    @Test
    fun getContenderByRegistrationCode() {
        val contender = get<ContenderDto>("/api/contender/findByCode?code=ABCD1234", HttpStatus.OK)

        assertThat(contender.id).isEqualTo(1)
        assertThat(contender.contestId).isEqualTo(1)
        assertThat(contender.registrationCode).isEqualTo("ABCD1234")
        assertThat(contender.name).isNull()
        assertThat(contender.compClassId).isNull()
        assertThat(contender.entered).isNull()
        assertThat(contender.disqualified).isEqualTo(false)
    }

    @Test
    fun getContenderByIncorrectRegistrationCode() {
        get<ContenderDto>("/api/contender/findByCode?code=CODE9999", HttpStatus.NOT_FOUND)
    }

    @Test
    fun getContenderById() {
        val contender = get<ContenderDto>("/api/contender/1", HttpStatus.OK)
        assertThat(contender.id).isEqualTo(1)
    }

    @Nested
    inner class RegistrationTest : ControllerTestBase() {

        @Autowired private lateinit var contenderMapper: ContenderMapper
        @Autowired private lateinit var contenderRepository: ContenderRepository
        @Autowired private lateinit var compClassRepository: CompClassRepository

        private fun getContenderEntity(id: Int) = contenderRepository.findByIdOrNull(id)!!

        private fun getContenderDto(id: Int) = contenderMapper.convertToDto(getContenderEntity(id))

        @Test
        @Order(1)
        fun enterContest() {
            var contender = get<ContenderDto>("/api/contender/1", HttpStatus.OK)

            contender.name = "Morty"
            contender = put("/api/contender/1", contender, HttpStatus.OK)

            var entity = getContenderEntity(1)
            assertThat(entity.name).isEqualTo("Morty")
            assertThat(entity.compClass).isNull()
            assertThat(entity.entered).isNull()

            contender.compClassId = 2
            put<ContenderDto>("/api/contender/1", contender, HttpStatus.OK)

            entity = getContenderEntity(1)
            assertThat(entity.compClass?.id!!).isEqualTo(2)
            assertThat(entity.entered).isBeforeOrEqualTo(OffsetDateTime.now())
        }

        @Test
        @Order(2)
        fun changeNameAndSwitchClass() {
            val contender = getContenderDto(1)
            val entered = contender.entered

            contender.name = "Rick"
            contender.compClassId = 1
            put<ContenderDto>("/api/contender/1", contender, HttpStatus.OK)

            val entity = getContenderEntity(1)
            assertThat(entity.name).isEqualTo("Rick")
            assertThat(entity.compClass?.id!!).isEqualTo(1)
            assertThat(entity.entered).isEqualTo(entered)
        }

        @Test
        @Order(3)
        fun tryRemoveName() {
            val contender = getContenderDto(1)

            contender.name = null
            put<ContenderDto>("/api/contender/1", contender, HttpStatus.CONFLICT)
        }

        @Test
        @Order(3)
        fun tryResetCompClassSelection() {
            val contender = getContenderDto(1)

            contender.compClassId = null
            put<ContenderDto>("/api/contender/1", contender, HttpStatus.CONFLICT)
        }

        @Test
        @Order(3)
        fun tryChangeRegistrationCode() {
            val contender = getContenderDto(1)

            contender.registrationCode = "CODE9999"
            put<ContenderDto>("/api/contender/1", contender, HttpStatus.CONFLICT)
        }

        @Test
        @Order(3)
        fun tryChangeEnteredTimestamp() {
            val contender = getContenderDto(1)

            contender.entered = OffsetDateTime.now()
            put<ContenderDto>("/api/contender/1", contender, HttpStatus.CONFLICT)
        }

        @Test
        @Order(3)
        fun tryChangeDisqualifiedStatus() {
            val contender = getContenderDto(1)

            contender.disqualified = true
            put<ContenderDto>("/api/contender/1", contender, HttpStatus.CONFLICT)
        }

        @Test
        @Order(4)
        fun changeNameOrSwitchClassTooLate() {
            val contender = getContenderDto(1)

            val compClass = compClassRepository.findByIdOrNull(1)!!
            compClass.timeEnd = OffsetDateTime.now().minusMinutes(15)
            compClassRepository.save(compClass)

            contender.name = "Morty"
            contender.compClassId = 2
            put<ContenderDto>("/api/contender/1", contender, HttpStatus.FORBIDDEN)
        }
    }

    @Nested
    inner class TickProblemsLateAndEarlyTest : ControllerTestBase() {

        @Autowired private lateinit var contenderRepository: ContenderRepository
        @Autowired private lateinit var compClassRepository: CompClassRepository
        @Autowired private lateinit var contestRepository: ContestRepository

        private fun registerContender() {
            val contender = contenderRepository.findByIdOrNull(1)!!
            contender.name = "Morty"
            contender.compClass = compClassRepository.findByIdOrNull(1)
            contenderRepository.save(contender)
        }

        private fun setStartAndEndTime(start: OffsetDateTime, end: OffsetDateTime) {
            val compClass = compClassRepository.findByIdOrNull(1)!!
            compClass.timeBegin = start
            compClass.timeEnd = end
            compClassRepository.save(compClass)
        }

        @Test
        @Order(1)
        fun tickProblemBeforeContestStarted() {
            registerContender()
            setStartAndEndTime(OffsetDateTime.now().plusSeconds(1), OffsetDateTime.now().plusHours(3))

            val tick = TickDto(null, null, 1, 1, true)
            post<Any>("/api/contender/1/tick", tick, HttpStatus.FORBIDDEN)
        }

        @Test
        @Order(2)
        fun tickProblemAfterContestEndedButWithinGraceTime() {
            val now = OffsetDateTime.now()
            val startTime = now.minusHours(3)
            var tick = TickDto(null, null, 1, 1, false)

            setStartAndEndTime(startTime, now.minusSeconds(1))
            tick = post("/api/contender/1/tick", tick, HttpStatus.CREATED)

            setStartAndEndTime(startTime, now.minusMinutes(15).plusSeconds(1))
            put<TickDto>("/api/tick/${tick.id}", tick, HttpStatus.OK)
        }

        @Test
        @Order(3)
        fun tickProblemAfterContestEndedAndExceedingGraceTime() {
            val now = OffsetDateTime.now()
            val tick = TickDto(1, null, 1, 1, false)

            setStartAndEndTime(now.minusHours(3), now.minusMinutes(15))
            put<TickDto>("/api/tick/1", tick, HttpStatus.FORBIDDEN)
        }

        @Test
        @Order(4)
        fun tickProblemAfterContestEndedAndWithoutAnyGraceTime() {
            val now = OffsetDateTime.now()
            setStartAndEndTime(now.minusHours(3), now)

            val contest = contestRepository.findByIdOrNull(1)!!
            contest.gracePeriod = 0
            contestRepository.save(contest)

            val tick = TickDto(null, null, 1, 5, true)
            post<Any>("/api/contender/1/tick", tick, HttpStatus.FORBIDDEN)
        }
    }

    @Nested
    inner class TickProblemsTest : ControllerTestBase() {

        @Autowired private lateinit var tickRepository: TickRepository
        @Autowired private lateinit var contenderRepository: ContenderRepository
        @Autowired private lateinit var compClassRepository: CompClassRepository

        private fun registerContender() {
            val contender = contenderRepository.findByIdOrNull(1)!!
            contender.name = "Morty"
            contender.compClass = compClassRepository.findByIdOrNull(1)
            contenderRepository.save(contender)
        }

        private fun openContest() {
            val compClass = compClassRepository.findByIdOrNull(1)!!
            compClass.timeBegin = OffsetDateTime.now()
            compClass.timeEnd = OffsetDateTime.now().plusHours(3)
            compClassRepository.save(compClass)
        }

        @Test
        @Order(1)
        fun tickProblemBeforeRegistered() {
            val tick = TickDto(null, null, 1, 1, true)
            post<Any>("/api/contender/1/tick", tick, HttpStatus.CONFLICT)
        }

        @Test
        @Order(2)
        fun getInitialScore() {
            registerContender()
            openContest()

            val score: ScoreDto = get("/api/contender/1/score", HttpStatus.OK)

            assertThat(score.total).isZero()
            assertThat(score.qualifying).isZero()
        }

        @Test
        @Order(3)
        fun tickProblem() {
            var tick = TickDto(null, null, 1, 5, true)
            tick = post("/api/contender/1/tick", tick, HttpStatus.CREATED)

            val entity = tickRepository.findByIdOrNull(tick.id)!!
            assertThat(entity.timestamp).isCloseTo(OffsetDateTime.now(), Assertions.within(1, ChronoUnit.SECONDS))
            assertThat(entity.contender?.id!!).isEqualTo(1)
            assertThat(entity.problem?.id!!).isEqualTo(5)
            assertThat(entity.isFlash).isEqualTo(true)
        }

        @Test
        @Order(4)
        fun tickProblemTwice() {
            val tick = TickDto(null, null, 1, 5, true)
            post<TickDto>("/api/contender/1/tick", tick, HttpStatus.CONFLICT)
        }

        @Test
        @Order(5)
        fun removeTick() {
            var tick = TickDto(null, null, 1, 8, false)
            tick = post("/api/contender/1/tick", tick, HttpStatus.CREATED)

            delete<TickDto>("/api/tick/${tick.id}", HttpStatus.NO_CONTENT)

            assertThat(tickRepository.findByIdOrNull(tick.id)).isNull()
        }

        @Test
        @Order(6)
        fun editTick() {
            var tick = TickDto(null, null, 1, 8, false)
            tick = post("/api/contender/1/tick", tick, HttpStatus.CREATED)

            tick.problemId = 7
            tick.flash = true

            put<TickDto>("/api/tick/${tick.id}", tick, HttpStatus.OK)

            val entity = tickRepository.findByIdOrNull(tick.id)!!
            assertThat(entity.problem?.id!!).isEqualTo(7)
            assertThat(entity.isFlash).isTrue()
        }

        @Test
        @Order(7)
        fun calculateScore() {
            tickRepository.deleteAll()

            fun tickProblem(problemId: Int, isFlash: Boolean) {
                val tick = TickDto(null, null, 1, problemId, isFlash)
                post<TickDto>("/api/contender/1/tick", tick, HttpStatus.CREATED)
            }

            tickProblem(1, false)
            tickProblem(2, false)
            tickProblem(3, false)
            tickProblem(4, false)
            tickProblem(5, false)
            tickProblem(6, true)
            tickProblem(7, true)
            tickProblem(8, false)

            val score = get<ScoreDto>("/api/contender/1/score", HttpStatus.OK)
            assertThat(score.total).isEqualTo(1143)
            assertThat(score.qualifying).isEqualTo(768)
        }

        @Test
        @Order(8)
        fun listTicks() {
            val ticks = get<List<TickDto>>("/api/contender/1/tick", HttpStatus.OK)
            assertThat(ticks).hasSize(8)

            val tick = ticks.associateBy({ it.problemId }, { it })[6]!!

            assertThat(tick.timestamp).isCloseTo(OffsetDateTime.now(), Assertions.within(1, ChronoUnit.MINUTES))
            assertThat(tick.contenderId).isEqualTo(1)
            assertThat(tick.problemId).isEqualTo(6)
            assertThat(tick.flash).isEqualTo(true)
        }

        @Test
        @Order(9)
        fun scoreAfterDisqualified() {
            val contender = contenderRepository.findByIdOrNull(1)!!
            contender.disqualified = true
            contenderRepository.save(contender)

            val score = get<ScoreDto>("/api/contender/1/score", HttpStatus.OK)
            assertThat(score.total).isZero()
            assertThat(score.qualifying).isZero()
        }
    }
}
