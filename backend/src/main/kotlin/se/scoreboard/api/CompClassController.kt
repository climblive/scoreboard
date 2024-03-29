package se.scoreboard.api

import io.swagger.annotations.Api
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.CompClassDto
import se.scoreboard.dto.ContenderDto
import se.scoreboard.mapper.CompClassMapper
import se.scoreboard.mapper.ContenderMapper
import se.scoreboard.service.CompClassService
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = ["Comp Classes"])
class CompClassController @Autowired constructor(
        val compClassService: CompClassService,
        private val contenderMapper: ContenderMapper,
        private val compClassMapper: CompClassMapper) {

    @GetMapping("/compClasses/{id}")
    @PreAuthorize("hasPermission(#id, 'CompClass', 'read')")
    @Transactional
    fun getCompClass(@PathVariable("id") id: Int) = compClassService.findById(id)

    @GetMapping("/compClasses/{id}/contenders")
    @PreAuthorize("hasPermission(#id, 'CompClass', 'read')")
    @Transactional
    fun getCompClassContenders(@PathVariable("id") id: Int) : List<ContenderDto> =
            compClassService.fetchEntity(id).contenders.map { contender -> contenderMapper.convertToDto(contender) }

    @PutMapping("/compClasses/{id}")
    @PreAuthorize("hasPermission(#id, 'CompClass', 'write')")
    @Transactional
    fun updateCompClass(
            @PathVariable("id") id: Int,
            @RequestBody compClass : CompClassDto): ResponseEntity<CompClassDto> {
        val old = compClassService.fetchEntity(id)

        val entity = compClassMapper.convertToEntity(compClass)
        entity.contest = old.contest
        entity.organizer = old.organizer

        return compClassService.update(id, entity)
    }

    @DeleteMapping("/compClasses/{id}")
    @PreAuthorize("hasPermission(#id, 'CompClass', 'delete')")
    @Transactional
    fun deleteCompClass(@PathVariable("id") id: Int) = compClassService.delete(id)
}
