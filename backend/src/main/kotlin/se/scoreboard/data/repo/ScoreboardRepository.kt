package se.scoreboard.data.repo

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.NoRepositoryBean
import org.springframework.data.repository.PagingAndSortingRepository

@NoRepositoryBean
interface ScoreboardRepository<EntityType, ID> : PagingAndSortingRepository<EntityType, ID> {
    fun findAllByContenderId(contenderId: Int, pageable: Pageable?): Page<EntityType>
    fun findAllByOrganizerIds(organizerIds: List<Int>, pageable: Pageable?): Page<EntityType>
}