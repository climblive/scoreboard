package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.ContestDto
import se.scoreboard.dto.SeriesDto
import se.scoreboard.mapper.ContestMapper
import se.scoreboard.mapper.SeriesMapper
import se.scoreboard.service.SeriesService
import javax.servlet.http.HttpServletRequest
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Series"])
class SeriesController @Autowired constructor(
        private val seriesService: SeriesService,
        private var contestMapper: ContestMapper,
        private val seriesMapper: SeriesMapper) {

    @GetMapping("/series/{id}")
    @PreAuthorize("hasPermission(#id, 'Series', 'read')")
    @Transactional
    fun getSeries(@PathVariable("id") id: Int) = seriesService.findById(id)

    @GetMapping("/series/{id}/contest")
    @PreAuthorize("hasPermission(#id, 'Series', 'read')")
    @Transactional
    fun getSeriesContests(@PathVariable("id") id: Int) : List<ContestDto> =
            seriesService.fetchEntity(id).contests.map { contest -> contestMapper.convertToDto(contest) }

    @PutMapping("/series/{id}")
    @PreAuthorize("hasPermission(#id, 'Series', 'write')")
    @Transactional
    fun updateSeries(
            @PathVariable("id") id: Int,
            @RequestBody series : SeriesDto) = seriesService.update(id, seriesMapper.convertToEntity(series))

    @DeleteMapping("/series/{id}")
    @PreAuthorize("hasPermission(#id, 'Series', 'delete')")
    @Transactional
    fun deleteSeries(@PathVariable("id") id: Int) = seriesService.delete(id)
}
