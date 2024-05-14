package com.kreitefy.application.service;

import com.kreitefy.application.dto.CancionesDto;
import com.kreitefy.application.dto.UserDto;
import com.kreitefy.domain.entity.User;

import java.util.List;
import java.util.Optional;

public interface AuthService {
    public UserDto register(UserDto userDto);
    Optional<UserDto> getUser(String username);

}
