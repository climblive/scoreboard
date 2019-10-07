package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import se.scoreboard.createRegistrationCode
import se.scoreboard.data.domain.*
import se.scoreboard.data.repo.*
import se.scoreboard.getUserPrincipal
import java.time.Duration
import java.time.OffsetDateTime
import java.time.temporal.ChronoUnit
import javax.transaction.Transactional
import kotlin.random.Random

@Service
class GeneratorService @Autowired constructor(
        val compClassRepository: CompClassRepository,
        val contenderRepository: ContenderRepository,
        val contestRepository: ContestRepository,
        val problemRepository: ProblemRepository,
        val tickRepository: TickRepository,
        val organizerRepository: OrganizerRepository,
        val locationRepository: LocationRepository,
        val colorRepository: ColorRepository) {

    @Transactional
    fun generateContest() {
        val organizer = getRandomOrganizerOfUser()
        val location = createLocation(organizer!!)
        val contest = createContest(location, organizer)
        val compClasses: List<CompClass> = createCompClasses(contest)
        val colors = createColors(organizer)
        val problems = createProblems(contest, colors)
        val contenders = createContenders(compClasses)
        createTicks(contenders, problems)
    }

    private fun getRandomOrganizerOfUser(): Organizer? {
        return organizerRepository.findByIdOrNull(getUserPrincipal()?.organizerIds?.random())
    }

    private fun createLocation(organizer: Organizer): Location {
        val names = listOf(
                "Alphaville", "Bottleneck", "Brigadoon", "Brushwood Gluch", "Castle Rock", "Castleville",
                "Cross Corners", "Dirt", "Domingo", "Emerald City", "Fairview", "Fernfield", "Flagstone",
                "Goldstadt", "Hadleyville", "Harper", "Hill Valley", "Holstenwall", "Innisfree", "La Mort Rouge",
                "Mapleton", "Maycomb", "Mega City", "Metro City", "Metroville", "Mos Eisley", "New Winton",
                "Oakey Oaks", "Perfection", "Pleasantville", "Questa Verde", "Raccoon City", "Radiator Springs",
                "Red Gap", "Rivertown", "Rock Ridge", "Rockwell", "San Fransokyo", "Shinbone", "Tromaville")

        val location = Location(null, organizer, names.random(), "", "")
        return locationRepository.save(location)
    }

    private fun createContest(location: Location, organizer: Organizer): Contest {
        val formats = listOf("Boulder Cup", "Bouldering National Championship", "Bouldering World Championship", "Rock Master")

        val contest = Contest(null, location, organizer, null, "%s %s".format(location.name, formats.random()),
                null,
                Random.nextInt(5, 10), Random.nextInt(5, 10),
                null, 15 * 60)

        return contestRepository.save(contest)
    }

    private fun createCompClasses(contest: Contest): List<CompClass> {
        val names = listOf("Youth", "Male", "Female")

        var compDay = OffsetDateTime.now()
                .truncatedTo(ChronoUnit.DAYS)
                .plusDays(Random.nextInt(0, 100).toLong())
        val start = compDay.plusHours(Random.nextInt(15, 19).toLong())
        val end = start.plusHours(Random.nextInt(2,3).toLong())
        if (Random.nextInt() % 10 == 0) {
            end.plusMinutes(30)
        }

        val compClasses = names.map {
            name -> CompClass(null, contest, contest.id, name, null, start, end) }

        return compClassRepository.saveAll(compClasses).toList()
    }

    private fun createColors(organizer: Organizer): List<Color> {
        val colors = listOf(
            Pair("Red", "#f44336"),
            Pair("Green", "#4caf50"),
            Pair("Blue", "#0288d1"),
            Pair("Purple", "#E410EB"),
            Pair("Yellow", "#ffeb3b"),
            Pair("Black", "#050505"),
            Pair("Orange", "#ff9800"),
            Pair("Pink", "#F628A5"),
            Pair("White", "#FAFAFA")
        ).map { pair -> Color(null, organizer, pair.first, pair.second, null, false) }

        return colorRepository.saveAll(colors).toList()
    }

    private fun createProblems(contest: Contest, colors: List<Color>): List<Problem> {
        val problems = IntRange(1, Random.nextInt(2, 4) * 10).map { num ->
            Problem(null, colors.random(), contest, num, Random.nextInt(1, 5) * 50, 0)
        }

        return problemRepository.saveAll(problems).toList()
    }

    private fun createContenders(compClasses: List<CompClass>): List<Contender> {
        var names = mutableListOf(
                "Adam Ondra", "Chris Sharma", "Steph Davis", "Catherine Destivelle",
                "Dean Potter", "Alex Honnold", "Lynn Hill", "Tommy Caldwell", "Beth Rodden",
                "John Long", "David Lama", "Sasha DiGiulian", "Ashima Shiraishi", "Jongwon CHON",
                "Kokoro FUJII", "Yuji INOUE", "Jernej KRUDER", "Tomoa NARASAKI",
                "Yoshiyuki OGATA", "Anze PEHARC", "Aleksey RUBTSOV", "Rei SUGIMOTO",
                "Tomoaki TAKATA", "Jakob SCHUBERT", "Gregor VEZONIk", "Alma BESTVATER",
                "Kyra CONDIE", "Shauna COXSEY", "Janja GARNBRET", "Stasa GEJO",
                "Fanny GIBERT", "Futaba ITO", "Katja KADIC", "Ekaterina KIPRIIANOVA",
                "Petra KLINGLER", "Akiyo NOGUCHI", "Miho NONAKA", "Lucka RAKOVEC",
                "Sol SA", "Manon HILY", "Tjasa KALAN", "Jain KIM", "Mei KOTAKE",
                "Mia KRAMPL", "Mina MARKOVIC", "Akiyo NOGUCHI", "Jessica PILZ",
                "Hannah SCHUBERT", "Romain DESGRANGES", "Stefano GHISOLFI", "Yuki HADA",
                "Taisei HOMMA", "Sascha LEHMANN", "Alexander MEGOS", "Hyunbin MIN",
                "Domen SKOFIC", "Jakob SCHUBERT", "Francesco VETTORATA")

        val contenders = IntRange(1, Random.nextInt(1, 20)).map {
            var name: String? = null
            var entered: OffsetDateTime? = null
            var compClass: CompClass? = null

            if (Random.nextInt() % 10 != 0) {
                name = names.random().split(" ").map { it.toLowerCase().capitalize() }.joinToString(" ")
                names.remove(name)
                compClass = compClasses.random()
                entered = compClass.timeBegin?.plusMinutes(Random.nextInt(0, 10).toLong())
            }
            Contender(null, compClass, compClasses.first().contest, createRegistrationCode(8), name, entered)
        }

        return contenderRepository.saveAll(contenders).toList()
    }

    private fun createTicks(contenders: List<Contender>, problems: List<Problem>): List<Tick> {
        val ticks: MutableList<Tick> = mutableListOf()
        contenders.filter { it.entered != null }.forEach { contender ->
            ticks.addAll(problems.filter { Random.nextInt() % 3 == 0 }.map { problem ->
                val compClass = contender.compClass
                val duration = Duration.between(contender.entered, compClass?.timeEnd)
                val timestamp = contender.entered?.plusMinutes(Random.nextInt(0, duration.toMinutes().toInt()).toLong())
                Tick(null, timestamp, contender, problem, false)
            })
        }

        return tickRepository.saveAll(ticks).toList()
    }
}