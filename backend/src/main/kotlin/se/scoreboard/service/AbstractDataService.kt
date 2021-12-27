package se.scoreboard.service

import org.slf4j.LoggerFactory
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
import se.scoreboard.security.CustomPermissionEvaluator
import se.scoreboard.userHasRole
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import javax.servlet.http.HttpServletRequest
import javax.transaction.Transactional

abstract class AbstractDataService<EntityType : AbstractEntity<ID>, DtoType, ID> constructor(
    protected val entityRepository: ScoreboardRepository<EntityType, ID>) {

    protected var MSG_NOT_FOUND = "Not found"

    abstract var entityMapper: AbstractMapper<EntityType, DtoType>

    private var logger = LoggerFactory.getLogger(AbstractDataService::class.java)

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
    open fun findAll(request: HttpServletRequest) : ResponseEntity<List<DtoType>> {
        return search(request, PageRequest.of(0, 1000))
    }

    @Transactional
    open fun search(request: HttpServletRequest, pageable: Pageable?) : ResponseEntity<List<DtoType>> {
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
            val organizerId: Int? = request.getHeader("Organizer-Id")?.toInt()
            if (organizerId != null) {
                page = entityRepository.findAllByOrganizerIds(listOf(organizerId), pageable)
            } else {
                page = entityRepository.findAll(pageable ?: PageRequest.of(0, 1000))
            }
        }

        headers.set("Content-Range", "bytes %d-%d/%d".format(
                page.number * page.size, page.number * page.size + page.numberOfElements, page.totalElements))
        result = page.content.map { entity -> entityMapper.convertToDto(entity) }

        return ResponseEntity(result, headers, HttpStatus.OK)
    }

    @Transactional
    open fun findById(id: ID) : ResponseEntity<DtoType> {
        return ResponseEntity.ok(entityMapper.convertToDto(fetchEntity(id)))
    }

    @Transactional
    open fun create(entity: EntityType): ResponseEntity<DtoType> {
        entity.id = null

        checkConstraints(null, entityMapper.convertToDto(entity))

        onCreate(Phase.BEFORE, entity)
        val savedEntity = entityRepository.save(entity)
        entityManager.flush()
        onCreate(Phase.AFTER, savedEntity)

        return ResponseEntity(entityMapper.convertToDto(savedEntity), HttpStatus.CREATED)
    }

    @Transactional
    open fun update(id: ID, entity: EntityType): ResponseEntity<DtoType> {
        entity.id = id

        val old = entityRepository.findByIdOrNull(id) ?: throw WebException(HttpStatus.NOT_FOUND, MSG_NOT_FOUND)

        checkConstraints(entityMapper.convertToDto(old), entityMapper.convertToDto(entity))

        entityManager.detach(old)

        onUpdate(Phase.BEFORE, old, entity)
        val updatedEntity = entityRepository.save(entity)
        entityManager.flush()
        onUpdate(Phase.AFTER, old, updatedEntity)

        return ResponseEntity.ok(entityMapper.convertToDto(updatedEntity))
    }

    @Transactional
    open fun delete(id: ID) : ResponseEntity<DtoType> {
        val entity = fetchEntity(id)

        onDelete(Phase.BEFORE, entity)
        entityRepository.delete(entity)
        entityManager.flush()
        onDelete(Phase.AFTER, entity)

        return ResponseEntity.noContent().build()
    }

    open fun fetchEntity(id: ID) : EntityType {
        return entityRepository.findByIdOrNull(id) ?: throw WebException(HttpStatus.NOT_FOUND, MSG_NOT_FOUND)
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

    enum class Phase {
        BEFORE,
        AFTER
    }

    protected open fun onCreate(phase: Phase, new: EntityType) {
    }

    protected open fun onUpdate(phase: Phase, old: EntityType, new: EntityType) {
    }

    protected open fun onDelete(phase: Phase, old: EntityType) {
    }
}
