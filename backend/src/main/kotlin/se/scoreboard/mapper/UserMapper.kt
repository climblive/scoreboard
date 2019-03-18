package se.scoreboard.mapper

import org.mapstruct.Mapper
import se.scoreboard.data.domain.User
import se.scoreboard.dto.UserDto

@Mapper
interface UserMapper : AbstractMapper<User, UserDto>