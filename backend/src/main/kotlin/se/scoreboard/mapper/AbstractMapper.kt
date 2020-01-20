package se.scoreboard.mapper

import org.mapstruct.InheritInverseConfiguration
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

abstract class AbstractMapper<EntityType, DtoType> {
    @PersistenceContext
    protected lateinit var entityManager: EntityManager

    abstract fun convertToDto(source: EntityType): DtoType

    @InheritInverseConfiguration(name = "convertToDto")
    abstract fun convertToEntity(source: DtoType): EntityType
}