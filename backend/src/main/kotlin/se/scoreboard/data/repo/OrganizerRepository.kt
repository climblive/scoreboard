package se.scoreboard.data.repo

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Organizer

@Repository
interface OrganizerRepository : ScoreboardRepository<Organizer, Int> {
}