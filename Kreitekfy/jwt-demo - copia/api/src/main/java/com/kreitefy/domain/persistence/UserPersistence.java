package com.kreitefy.domain.persistence;

import com.kreitefy.domain.entity.User;

import java.util.Optional;

public interface UserPersistence {
    User save(User user);
    Optional<User> find(String username);
}
