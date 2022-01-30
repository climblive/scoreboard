package se.scoreboard.data.repo

import org.springframework.data.repository.NoRepositoryBean
import org.springframework.data.repository.PagingAndSortingRepository

@NoRepositoryBean
interface ScoreboardRepository<EntityType, ID> : PagingAndSortingRepository<EntityType, ID> {
}