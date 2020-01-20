package se.scoreboard.mapper

import org.mapstruct.*
import se.scoreboard.data.domain.User
import se.scoreboard.dto.UserDto

@Mapper(componentModel = "spring")
abstract class UserMapper : AbstractMapper<User, UserDto>() {
    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "organizers", ignore = true)
    )
    abstract override fun convertToEntity(source: UserDto): User
}
