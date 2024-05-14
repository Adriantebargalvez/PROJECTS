package com.kreitefy.infraestructure.rest.auth;

import com.kreitefy.application.dto.UserDto;
import com.kreitefy.domain.entity.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

public class AuthUserDetails implements UserDetails {

    private final String userName;
    private final String userPassword;
    private final Role role;

    public AuthUserDetails(UserDto userDto) {
        this.userName = userDto.getUsername();
        this.userPassword = userDto.getPassword();
        this.role = userDto.getRole();
    }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override public String getPassword() {
        return userPassword;
    }

    @Override public String getUsername() {
        return userName;
    }

    @Override public boolean isAccountNonExpired() {
        return true;
    }

    @Override public boolean isAccountNonLocked() {
        return true;
    }

    @Override public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override public boolean isEnabled() {
        return true;
    }
}
