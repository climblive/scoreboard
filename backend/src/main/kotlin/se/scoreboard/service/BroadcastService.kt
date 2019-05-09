package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.extension.getQualificationScore
import se.scoreboard.data.domain.extension.getTotalScore
import se.scoreboard.dto.ScoreboardListItemDto
import se.scoreboard.dto.ScoreboardPushItemDto

@Service
class BroadcastService @Autowired constructor(private val simpMessagingTemplate : SimpMessagingTemplate?) {
    fun broadcast(contender: Contender) {
        if (simpMessagingTemplate != null) {
            val scoreboardListItemDTO = ScoreboardListItemDto(
                    contender.id!!,
                    contender.name!!,
                    contender.getTotalScore(),
                    contender.getQualificationScore())
            val scoreboardPushItemDTO = ScoreboardPushItemDto(contender.compClass!!.id!!, scoreboardListItemDTO)
            simpMessagingTemplate.convertAndSend("/topic/scoreboard/" + contender.contest!!.id, scoreboardPushItemDTO)
        }
    }
}
