package se.scoreboard.data.repo

import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Organizer

@Repository
interface OrganizerRepository : ScoreboardRepository<Organizer, Int> {
}