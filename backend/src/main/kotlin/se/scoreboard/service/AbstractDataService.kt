package se.scoreboard.service

import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.findByIdOrNull
import se.scoreboard.data.domain.AbstractEntity
import se.scoreboard.exception.NotFoundException
import se.scoreboard.mapper.AbstractMapper
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import javax.transaction.Transactional

abstract class AbstractDataService<EntityType : AbstractEntity<ID>, DtoType, ID> constructor(
    protected val entityRepository: CrudRepository<EntityType, ID>) {

    protected var MSG_NOT_FOUND = "Not found";

    abstract var entityMapper: AbstractMapper<EntityType, DtoType>

    @PersistenceContext
    protected lateinit var entityManager: EntityManager

    @Transactional
    open fun findAll() : List<DtoType> =
        entityRepository.findAll().map { resource -> entityMapper.convertToDto(resource) }

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
    open fun delete(id: ID) {
        var entity = fetchEntity(id)
        entityRepository.delete(entity)
    }

    @Transactional
    open fun fetchEntity(id: ID) : EntityType {
        return entityRepository.findByIdOrNull(id) ?: throw NotFoundException(MSG_NOT_FOUND)
    }

    open protected fun handleNested(entity: EntityType, dto: DtoType) {
    }
}
