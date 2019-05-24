package se.scoreboard.api

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
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
        val compClassService: CompClassService) {

    private lateinit var contenderMapper: ContenderMapper

    init {
        contenderMapper = Mappers.getMapper(ContenderMapper::class.java)
    }

    @GetMapping("/compClass")
    @Transactional
    fun getCompClasses(@RequestParam("filter", required = false) filter: String?, pageable: Pageable?) = compClassService.search(filter, pageable)

    @GetMapping("/compClass/{id}")
    @Transactional
    fun getCompClass(@PathVariable("id") id: Int) = compClassService.findById(id)

    @GetMapping("/compClass/{id}/contender")
    @Transactional
    fun getCompClassContenders(@PathVariable("id") id: Int) : List<ContenderDto> =
            compClassService.fetchEntity(id).contenders.map { contender -> contenderMapper.convertToDto(contender) }

    @PostMapping("/compClass")
    @Transactional
    fun createCompClass(@RequestBody compClass : CompClassDto) = compClassService.create(compClass)

    @PutMapping("/compClass/{id}")
    @Transactional
    fun updateCompClass(
            @PathVariable("id") id: Int,
            @RequestBody compClass : CompClassDto) = compClassService.update(id, compClass)

    @DeleteMapping("/compClass/{id}")
    @Transactional
    fun deleteCompClass(@PathVariable("id") id: Int) = compClassService.delete(id)
}
