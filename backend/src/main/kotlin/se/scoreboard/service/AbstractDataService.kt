package se.scoreboard.service

import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import se.scoreboard.data.domain.AbstractEntity
import se.scoreboard.data.repo.ScoreboardRepository
import se.scoreboard.exception.WebException
import se.scoreboard.getUserPrincipal
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.userHasRole
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import javax.transaction.Transactional

abstract class AbstractDataService<EntityType : AbstractEntity<ID>, DtoType, ID> constructor(
    protected val entityRepository: ScoreboardRepository<EntityType, ID>) {

    protected var MSG_NOT_FOUND = "Not found"

    abstract var entityMapper: AbstractMapper<EntityType, DtoType>

    @PersistenceContext
    protected lateinit var entityManager: EntityManager

    @Transactional
    open fun findAll() : List<DtoType> {
        return search(PageRequest.of(0, 1000)).body
    }

    @Transactional
    open fun search(pageable: Pageable?) : ResponseEntity<List<DtoType>> {
        var result: List<DtoType>

        var headers = HttpHeaders()
        headers.set("Access-Control-Expose-Headers", "Content-Range")
        var page: Page<EntityType>

        val principal = getUserPrincipal()

        if (userHasRole("ORGANIZER")) {
            page = entityRepository.findAllByOrganizerIds(principal?.organizerIds!!, pageable)
        } else if (userHasRole("CONTENDER")) {
            page = entityRepository.findAllByContenderId(principal?.contenderId!!, pageable)
        } else {
            page = entityRepository.findAll(pageable)
        }

        headers.set("Content-Range", "bytes %d-%d/%d".format(
                page.number * page.size, page.number * page.size + page.numberOfElements, page.totalElements))
        result = page.content.map { entity -> entityMapper.convertToDto(entity) }

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
        var entity = entityMapper.convertToEntity(dto)
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
        return entityRepository.findByIdOrNull(id) ?: throw WebException(HttpStatus.NOT_FOUND, MSG_NOT_FOUND)
    }

    @Transactional
    open fun fetchEntities(ids: List<ID>) : Iterable<EntityType> {
        return entityRepository.findAllById(ids)
    }

    open protected fun handleNested(entity: EntityType, dto: DtoType) {
    }
}
