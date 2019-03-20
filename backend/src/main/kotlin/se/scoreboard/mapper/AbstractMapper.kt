package se.scoreboard.mapper

import org.mapstruct.InheritConfiguration
import org.mapstruct.InheritInverseConfiguration
import org.mapstruct.MappingTarget

interface AbstractMapper<EntityType, DtoType> {
    fun convertToDto(source: EntityType): DtoType

    @InheritConfiguration
    fun convertIntoEntity(source: DtoType, @MappingTarget target: EntityType): EntityType

    @InheritInverseConfiguration(name = "convertToDto")
    fun convertToEntity(source: DtoType): EntityType
}