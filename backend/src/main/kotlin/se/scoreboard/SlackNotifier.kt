package se.scoreboard

import org.springframework.beans.factory.annotation.Value
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.Contest
import org.springframework.web.client.RestTemplate
import se.scoreboard.configuration.MyUserPrincipal
import se.scoreboard.data.domain.User


@Service
class SlackNotifier {
    @Value("\${slack.webhook:}")
    private lateinit var url: String

    data class Notification(val text: String)

    @Async
    fun newContest(contest: Contest, principal: MyUserPrincipal?) {
        post(">User *${principal?.username}* created new contest <https://admin.climblive.app/contests/${contest.id}|*${contest.name}*>")
    }

    @Async
    fun newUser(user: User) {
        post(">User *${user.username}* just logged in for the first time \uD83C\uDF89")
    }

    private fun post(message: String) {
        if (url.isEmpty()) {
            return
        }

        val restTemplate = RestTemplate()
        restTemplate.postForEntity(url, Notification(message), String::class.java)
    }
}
