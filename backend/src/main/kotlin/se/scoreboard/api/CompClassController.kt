package se.scoreboard.api

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import se.scoreboard.dto.CompClassDto
import se.scoreboard.dto.ContenderDto
import se.scoreboard.mapper.ContenderMapper
import se.scoreboard.service.CompClassService
import javax.transaction.Transactional

@RestController
@CrossOrigin
@RequestMapping("/api")
class CompClassController @Autowired constructor(
        val compClassService: CompClassService,
        private var contenderMapper: ContenderMapper) {

    @GetMapping("/compClass")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getCompClasses(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = compClassService.search(pageable)

    @GetMapping("/compClass/{id}")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getCompClass(@PathVariable("id") id: Int) = compClassService.findById(id)

    @GetMapping("/compClass/{id}/contender")
    @PostAuthorize("hasPermission(returnObject, 'read')")
    @Transactional
    fun getCompClassContenders(@PathVariable("id") id: Int) : List<ContenderDto> =
            compClassService.fetchEntity(id).contenders.map { contender -> contenderMapper.convertToDto(contender) }

    @PostMapping("/compClass")
    @PreAuthorize("hasPermission(#compClass, 'create')")
    @Transactional
    fun createCompClass(@RequestBody compClass : CompClassDto) = compClassService.create(compClass)

    @PutMapping("/compClass/{id}")
    @PreAuthorize("hasPermission(#id, 'CompClassDto', 'update') && hasPermission(#compClass, 'update')")
    @Transactional
    fun updateCompClass(
            @PathVariable("id") id: Int,
            @RequestBody compClass : CompClassDto) = compClassService.update(id, compClass)

    @DeleteMapping("/compClass/{id}")
    @PreAuthorize("hasPermission(#id, 'CompClassDto', 'delete')")
    @Transactional
    fun deleteCompClass(@PathVariable("id") id: Int) = compClassService.delete(id)
}
