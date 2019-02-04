package se.scoreboard.data.repository

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import se.scoreboard.data.domain.Color

@Repository
interface ColorRepository : CrudRepository<Color, Integer> {
}