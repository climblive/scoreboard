package se.scoreboard.service

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.User
import se.scoreboard.data.repo.UserRepository
import se.scoreboard.dto.UserDto
import se.scoreboard.mapper.AbstractMapper
import se.scoreboard.mapper.UserMapper
import javax.transaction.Transactional

@Service
class UserService @Autowired constructor(
    private val userRepository: UserRepository) : AbstractDataService<User, UserDto, Int>(userRepository) {

    override lateinit var entityMapper: AbstractMapper<User, UserDto>

    init {
        entityMapper = Mappers.getMapper(UserMapper::class.java)
    }

    @Transactional
    fun findByUsername(username: String): UserDto? {
        return userRepository.findByUsername(username)?.let { entityMapper.convertToDto(it) }
    }
}