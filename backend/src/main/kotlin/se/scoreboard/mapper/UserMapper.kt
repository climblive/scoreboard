package se.scoreboard.mapper

import org.mapstruct.*
import se.scoreboard.data.domain.User
import se.scoreboard.dto.UserDto

@Mapper(componentModel = "spring", uses = [OrganizerMapper::class])
abstract class UserMapper : AbstractMapper<User, UserDto>() {
    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings
    abstract override fun convertToEntity(source: UserDto): User
}
