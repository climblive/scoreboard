package se.scoreboard.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.findByIdOrNull
import se.scoreboard.data.domain.AbstractEntity
import se.scoreboard.exception.NotFoundException
import se.scoreboard.mapper.AbstractMapper
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import javax.transaction.Transactional
import com.fasterxml.jackson.module.kotlin.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

abstract class AbstractDataService<EntityType : AbstractEntity<ID>, DtoType, ID> constructor(
    protected val entityRepository: PagingAndSortingRepository<EntityType, ID>) {

    protected var MSG_NOT_FOUND = "Not found";

    abstract var entityMapper: AbstractMapper<EntityType, DtoType>

    @PersistenceContext
    protected lateinit var entityManager: EntityManager

    @Transactional
    open fun findAll() : List<DtoType> {
        return entityRepository.findAll().map { resource -> entityMapper.convertToDto(resource) }
    }

    @Transactional
    open fun search(filter: String?, pageable: Pageable?) : ResponseEntity<List<DtoType>> {
        var result: List<DtoType>

        var headers = HttpHeaders()
        headers.set("Access-Control-Expose-Headers", "Content-Range")

        if (filter == null || filter == "{}") {
            var page: Page<EntityType> = entityRepository.findAll(pageable)
            headers.set("Content-Range", "bytes %d-%d/%d".format(page.number * page.size, page.numberOfElements, page.totalElements))
            result = page.content.map { entity -> entityMapper.convertToDto(entity) }
        } else {
            val mapper = jacksonObjectMapper()
            var filterMap: Map<String, List<ID>> = mapper.readValue(filter)
            result = if (filterMap.containsKey("id")) fetchEntities(filterMap["id"]!!).map { entity -> entityMapper.convertToDto(entity) } else findAll()
            headers.set("Content-Range", "bytes 0-%d/%d".format(result.size, result.size))
        }

        return ResponseEntity(result, headers, HttpStatus.OK)
    }

    @Transactional
    open fun findById(id: ID) : DtoType =
        entityMapper.convertToDto(fetchEntity(id))

    @Transactional
    open fun create(dto : DtoType) : DtoType {
        var entity: EntityType = entityMapper.convertToEntity(dto)
        entity.id = null
        handleNested(entity, dto)

        entity = entityRepository.save(entity)
        return entityMapper.convertToDto(entity)
    }

    @Transactional
    open fun update(id: ID, dto : DtoType) : DtoType {
        var entity = fetchEntity(id)

        entityMapper.convertIntoEntity(dto, entity)
        entity.id = id
        handleNested(entity, dto)

        entity = entityRepository.save(entity)
        return entityMapper.convertToDto(entity)
    }

    @Transactional
    open fun delete(id: ID) : DtoType {
        var entity = fetchEntity(id)
        entityRepository.delete(entity)
        return entityMapper.convertToDto(entity)
    }

    @Transactional
    open fun fetchEntity(id: ID) : EntityType {
        return entityRepository.findByIdOrNull(id) ?: throw NotFoundException(MSG_NOT_FOUND)
    }

    @Transactional
    open fun fetchEntities(ids: List<ID>) : Iterable<EntityType> {
        return entityRepository.findAllById(ids);
    }

    open protected fun handleNested(entity: EntityType, dto: DtoType) {
    }
}
