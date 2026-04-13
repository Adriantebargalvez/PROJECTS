package com.kreitefy.application.service.impl;

import com.kreitefy.application.dto.UserDto;
import com.kreitefy.application.mapper.UserMapper;
import com.kreitefy.application.service.AuthService;
import com.kreitefy.domain.entity.User;
import com.kreitefy.domain.persistence.UserPersistence;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserPersistence userPersistence;
    private final UserMapper userMapper;

    public AuthServiceImpl(UserPersistence userPersistence, UserMapper userMapper) {
        this.userPersistence = userPersistence;
        this.userMapper = userMapper;
    }

    @Override
    public UserDto register(UserDto userDto) {
        User user = userMapper.toEntity(userDto);
        return userMapper.toDto(userPersistence.save(user));
    }

    @Override
    public Optional<UserDto> getUser(String username) {
        return userPersistence.find(username).map(userMapper::toDto);
    }

    @Override
    public Optional<UserDto> getUserByEmail(String email) {
        return userPersistence.findByEmail(email).map(userMapper::toDto);
    }
}
