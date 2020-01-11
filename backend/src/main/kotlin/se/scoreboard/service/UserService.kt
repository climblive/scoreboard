package se.scoreboard.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.User
import se.scoreboard.data.repo.UserRepository
import se.scoreboard.dto.UserDto
import se.scoreboard.mapper.AbstractMapper
import javax.transaction.Transactional

@Service
class UserService @Autowired constructor(
    private val userRepository: UserRepository,
    override var entityMapper: AbstractMapper<User, UserDto>) : AbstractDataService<User, UserDto, Int>(userRepository) {

    @Transactional
    fun findByUsername(username: String): UserDto? {
        return userRepository.findByUsername(username)?.let { entityMapper.convertToDto(it) }
    }
}