package se.scoreboard.service

import org.mapstruct.factory.Mappers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import se.scoreboard.data.domain.User
import se.scoreboard.data.repo.UserRepository
import se.scoreboard.dto.UserDto
import se.scoreboard.exception.WebException
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
    fun findByEmail(email: String): UserDto? {
        return userRepository.findByEmail(email)?.let { entityMapper.convertToDto(it) }
    }
}