package se.scoreboard.service

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Color
import se.scoreboard.data.domain.Organizer
import se.scoreboard.data.repo.ColorRepository
import se.scoreboard.dto.ColorDto
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.mapper.ColorMapper

@Service
class ColorService @Autowired constructor(
    colorRepository: ColorRepository) : AbstractDataService<Color, ColorDto, Int>(colorRepository) {

    override lateinit var entityMapper: AbstractMapper<Color, ColorDto>

    init {
        entityMapper = Mappers.getMapper(ColorMapper::class.java)
    }

    override fun handleNested(entity: Color, dto: ColorDto) {
        entity.organizer = entityManager.getReference(Organizer::class.java, dto.organizerId)
    }
}