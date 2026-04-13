package com.kreitefy.application.service;

import com.kreitefy.application.dto.UserDto;

import java.util.Optional;

public interface AuthService {
    UserDto register(UserDto userDto);
    Optional<UserDto> getUser(String username);
    Optional<UserDto> getUserByEmail(String email);
}
