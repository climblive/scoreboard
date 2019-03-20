package se.scoreboard.mapper

import org.mapstruct.InheritInverseConfiguration
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Mappings
import se.scoreboard.data.domain.User
import se.scoreboard.dto.UserDto

@Mapper
interface UserMapper : AbstractMapper<User, UserDto> {
    @InheritInverseConfiguration(name = "convertToDto")
    @Mappings(
            Mapping(target = "organizers", ignore = true)
    )
    override fun convertToEntity(source: UserDto): User
}