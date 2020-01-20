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
import se.scoreboard.dto.scoreboard.RaffleWinnerPushItemDto
import se.scoreboard.dto.scoreboard.ScoreboardPushItemDto

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
        val raffleId = winner.raffle?.id!!
        val item = RaffleWinnerPushItemDto(raffleId, winner.contender?.id!!, winner.contender?.name!!, winner.timestamp!!)
        simpMessagingTemplate.convertAndSend("/topic/raffle/" + raffleId, item)
    }
}
