package se.scoreboard.service

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.RaffleWinner
import se.scoreboard.data.domain.extension.getQualificationScore
import se.scoreboard.data.domain.extension.getTotalScore
import se.scoreboard.dto.ScoreboardListItemDto
import se.scoreboard.dto.ScoreboardPushItemDto
import java.time.OffsetDateTime

@Service
class BroadcastService @Autowired constructor(private val simpMessagingTemplate : SimpMessagingTemplate) {

    companion object {
        private var logger = LoggerFactory.getLogger(BroadcastService::class.java)
    }

    fun broadcast(contender: Contender) {
        val scoreboardListItemDTO = ScoreboardListItemDto(
                contender.id!!,
                contender.name!!,
                contender.getTotalScore(),
                contender.getQualificationScore())
        val scoreboardPushItemDTO = ScoreboardPushItemDto(contender.compClass!!.id!!, scoreboardListItemDTO)
        simpMessagingTemplate.convertAndSend("/topic/scoreboard/" + contender.contest!!.id, scoreboardPushItemDTO)
    }

    fun broadcast(winner: RaffleWinner) {
        data class RaffleListItemDto (val contenderId: Int, val contenderName : String, val timestamp: OffsetDateTime)

        val item = RaffleListItemDto(winner.contender?.id!!, winner.contender?.name!!, winner.timestamp!!)
        simpMessagingTemplate.convertAndSend("/topic/raffle/" + winner.raffle?.id!!, item)
    }
}
