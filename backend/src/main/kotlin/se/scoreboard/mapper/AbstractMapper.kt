package se.scoreboard.mapper

import org.mapstruct.*

interface AbstractMapper<EntityType, DtoType> {
    fun convertToDto(source: EntityType): DtoType

    @InheritConfiguration
    fun convertIntoEntity(source: DtoType, @MappingTarget target: EntityType): EntityType

    @InheritInverseConfiguration(name = "convertToDto")
    fun convertToEntity(source: DtoType): EntityType
}