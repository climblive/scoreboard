package se.scoreboard.api

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ContestDto
import se.scoreboard.dto.ProblemDto
import se.scoreboard.dto.SeriesDto
import se.scoreboard.mapper.CompClassMapper
import se.scoreboard.mapper.ContenderMapper
import se.scoreboard.mapper.ContestMapper
import se.scoreboard.mapper.ProblemMapper
import se.scoreboard.service.SeriesService
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
class SeriesController @Autowired constructor(
        private val seriesService: SeriesService) {

    private lateinit var contestMapper: ContestMapper

    init {
        contestMapper = Mappers.getMapper(ContestMapper::class.java)
    }

    @GetMapping("/series")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getAllSeries(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = seriesService.search(pageable)

    @GetMapping("/series/{id}")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getSeries(@PathVariable("id") id: Int) = seriesService.findById(id)

    @GetMapping("/series/{id}/contest")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getSeriesContests(@PathVariable("id") id: Int) : List<ContestDto> =
            seriesService.fetchEntity(id).contests.map { contest -> contestMapper.convertToDto(contest) }

    @PostMapping("/series")
    @PreAuthorize("hasPermission(#series, 'create')")
    @Transactional
    fun createSeries(@RequestBody series : SeriesDto) = seriesService.create(series)

    @PutMapping("/series/{id}")
    @PreAuthorize("hasPermission(#id, 'SeriesDto', 'update') && hasPermission(#series, 'update')")
    @Transactional
    fun updateSeries(
            @PathVariable("id") id: Int,
            @RequestBody series : SeriesDto) = seriesService.update(id, series)

    @DeleteMapping("/series/{id}")
    @PreAuthorize("hasPermission(#id, 'SeriesDto', 'delete')")
    @Transactional
    fun deleteSeries(@PathVariable("id") id: Int) = seriesService.delete(id)
}
