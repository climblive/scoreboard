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

    enum class AttributeConstraintType {
        NON_NULLABLE,
        NON_ERASABLE,
        IMMUTABLE
    }

    private data class AttributeConstraint<DtoType>(
            val propertyName: String,
            val getter: (DtoType) -> Any?,
            val role: String?,
            val type: AttributeConstraintType)

    private var constraints: MutableList<AttributeConstraint<DtoType>> = mutableListOf()

    fun addConstraints(propertyName: String, getter: (DtoType) -> Any?, role: String?, vararg types: AttributeConstraintType) {
        for (type in types) {
            constraints.add(AttributeConstraint(propertyName, getter, role, type))
        }
    }

    @Transactional
    open fun findAll() : ResponseEntity<List<DtoType>> {
        return search(PageRequest.of(0, 1000))
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
    open fun findById(id: ID) : ResponseEntity<DtoType> =
        ResponseEntity.ok(entityMapper.convertToDto(fetchEntity(id)))

    @Transactional
    open fun create(dto : DtoType) : ResponseEntity<DtoType> {
        var entity: EntityType = entityMapper.convertToEntity(dto)
        entity.id = null
        handleNested(entity, dto)

        checkConstraints(null, dto)

        if (!verify(entity)) {
            throw WebException(HttpStatus.CONFLICT, null)
        }

        onChange(null, entity)

        entity = entityRepository.save(entity)
        return ResponseEntity(entityMapper.convertToDto(entity), HttpStatus.CREATED)
    }

    @Transactional
    open fun update(id: ID, dto : DtoType) : ResponseEntity<DtoType> {
        var entity = entityMapper.convertToEntity(dto)
        entity.id = id
        handleNested(entity, dto)

        val old = entityRepository.findByIdOrNull(id) ?: throw WebException(HttpStatus.NOT_FOUND, MSG_NOT_FOUND)

        checkConstraints(entityMapper.convertToDto(old), dto)

        if (!verify(entity)) {
            throw WebException(HttpStatus.CONFLICT, null)
        }

        onChange(old, entity)

        entity = entityRepository.save(entity)
        return ResponseEntity.ok(entityMapper.convertToDto(entity))
    }

    @Transactional
    open fun delete(id: ID) : ResponseEntity<DtoType> {
        var entity = fetchEntity(id)

        beforeDelete(entity)

        entityRepository.delete(entity)

        afterDelete(entity)

        return ResponseEntity.noContent().build()
    }

    @Transactional
    open fun fetchEntity(id: ID) : EntityType {
        return entityRepository.findByIdOrNull(id) ?: throw WebException(HttpStatus.NOT_FOUND, MSG_NOT_FOUND)
    }

    @Transactional
    open fun fetchEntities(ids: List<ID>) : Iterable<EntityType> {
        return entityRepository.findAllById(ids)
    }

    private fun checkConstraints(old: DtoType?, new : DtoType) {
        val principal = getUserPrincipal()?.authorities

        constraints.forEach {
            val propertyName = it.propertyName
            val getter = it.getter
            val oldValue: Any? = old?.let { getter(it) }
            val newValue: Any? = getter(new)
            val role: String? = it.role

            if (role != null && principal?.none { it.authority == role } ?: false) {
                return
            }

            when (it.type) {
                AttributeConstraintType.IMMUTABLE ->
                    if (old != null && oldValue != newValue) {
                        throw WebException(HttpStatus.CONFLICT, "Cannot alter immutable attribute $propertyName")
                    }
                AttributeConstraintType.NON_NULLABLE ->
                    if (newValue == null) {
                        throw WebException(HttpStatus.CONFLICT, "No value for non-null attribute $propertyName")
                    }
                AttributeConstraintType.NON_ERASABLE ->
                    if (old != null && oldValue != null && newValue == null) {
                        throw WebException(HttpStatus.CONFLICT, "Cannot erase value of attribute $propertyName")
                    }
            }
        }
    }

    protected open fun handleNested(entity: EntityType, dto: DtoType) {
    }

    protected open fun verify(entity: EntityType) : Boolean = true

    protected open fun onChange(old: EntityType?, new: EntityType) {
    }

    protected open fun beforeDelete(old: EntityType) {
    }

    protected open fun afterDelete(old: EntityType) {
    }
}
