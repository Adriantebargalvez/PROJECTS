package com.kreitefy.application.mapper;

import com.kreitefy.application.dto.UserDto;
import com.kreitefy.domain.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper extends EntityMapper<UserDto, User> {
    default User fromId(String username) {
        if (username == null) {
            return null;
        }
        User user = new User();
        user.setUsername(username);
        return user;
    }

}
