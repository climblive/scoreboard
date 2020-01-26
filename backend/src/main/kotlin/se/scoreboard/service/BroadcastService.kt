package se.scoreboard.service

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Contender
import se.scoreboard.data.domain.Raffle
import se.scoreboard.data.domain.RaffleWinner
import se.scoreboard.data.domain.extension.getQualificationScore
import se.scoreboard.data.domain.extension.getTotalScore
import se.scoreboard.data.domain.extension.isRegistered
import se.scoreboard.dto.ScoreboardListItemDto
import se.scoreboard.dto.scoreboard.RafflePushItemDto
import se.scoreboard.dto.scoreboard.RaffleWinnerPushItemDto
import se.scoreboard.dto.scoreboard.ScoreboardPushItemDto

@Service
class BroadcastService @Autowired constructor(private val simpMessagingTemplate : SimpMessagingTemplate) {

    companion object {
        private var logger = LoggerFactory.getLogger(BroadcastService::class.java)
    }

    fun broadcast(contender: Contender) {
        if (!contender.isRegistered()) {
            return
        }

        val contestId = contender.contest?.id!!

        val scoreboardListItemDTO = ScoreboardListItemDto(
                contender.id!!,
                contender.name!!,
                contender.getTotalScore(),
                contender.getQualificationScore())
        val item = ScoreboardPushItemDto(contender.compClass!!.id!!, scoreboardListItemDTO)
        send(contestId, "/scoreboard", item)
    }

    fun broadcast(winner: RaffleWinner) {
        val raffleId = winner.raffle?.id!!
        val contestId = winner.raffle?.contest?.id!!
        val item = RaffleWinnerPushItemDto(raffleId, winner.contender?.id!!, winner.contender?.name!!, winner.timestamp!!)
        send(contestId, "/raffle/winner", item)
    }

    fun broadcast(raffle: Raffle) {
        val contestId = raffle.contest?.id!!
        val item = RafflePushItemDto(raffle.id!!, raffle.isActive)
        send(contestId, "/raffle", item)
    }

    private fun send(contestId: Int, path: String, item: Any) {
        val topic = "/topic/contest/$contestId$path"
        simpMessagingTemplate.convertAndSend(topic, item)
    }
}
