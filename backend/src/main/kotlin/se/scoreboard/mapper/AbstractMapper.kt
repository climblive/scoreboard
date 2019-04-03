package se.scoreboard.mapper

import org.mapstruct.InheritInverseConfiguration

interface AbstractMapper<EntityType, DtoType> {
    fun convertToDto(source: EntityType): DtoType

    @InheritInverseConfiguration(name = "convertToDto")
    fun convertToEntity(source: DtoType): EntityType
}