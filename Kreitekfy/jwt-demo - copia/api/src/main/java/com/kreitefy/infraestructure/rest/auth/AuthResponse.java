package com.kreitefy.infraestructure.rest.auth;

import com.kreitefy.application.dto.UserDto;

public class AuthResponse {
    private String token;
    private UserDto user;

    public AuthResponse() {
    }

    public AuthResponse(String token) {
        this.token = token;
    }

    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public UserDto getUser() {
        return user;
    }
}
