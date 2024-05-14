package com.kreitefy.application.service.impl;

import com.kreitefy.application.mapper.UserMapper;
import com.kreitefy.application.service.AuthService;
import com.kreitefy.application.dto.UserDto;
import com.kreitefy.domain.entity.User;
import com.kreitefy.domain.persistence.UserPersistence;
import com.kreitefy.infraestructure.mappers.UsuarioMapper;
import com.kreitefy.infraestructure.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.nio.file.attribute.UserPrincipal;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserPersistence userPersistence;
    private final UserMapper userMapper;

    public AuthServiceImpl(UserPersistence userPersistence, UserMapper userMapper) {
        this.userPersistence = userPersistence;
        this.userMapper = userMapper;

    }

    public UserDto register(UserDto userDto) {
        User user = userMapper.toEntity(userDto);
        return userMapper.toDto(userPersistence.save(user));
    }

    @Override public Optional<UserDto> getUser(String username) {
        Optional<User> user = userPersistence.find(username);
        if (user.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(userMapper.toDto(user.get()));
    }

}
