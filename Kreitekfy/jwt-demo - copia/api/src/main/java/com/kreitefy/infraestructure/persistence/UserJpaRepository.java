package com.kreitefy.infraestructure.persistence;

import com.kreitefy.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserJpaRepository extends JpaRepository<User, String>{

}
