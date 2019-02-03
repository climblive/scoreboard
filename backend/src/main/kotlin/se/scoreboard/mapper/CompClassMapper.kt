package se.scoreboard.mapper

import org.springframework.stereotype.Component
import se.scoreboard.dto.CompClassDTO
import se.scoreboard.model.CompClass

@Component
class CompClassMapper {
    fun toDTO(compClass: CompClass): CompClassDTO = CompClassDTO(compClass.name, compClass.startTime.toEpochSecond(), compClass.endTime.toEpochSecond())
}
