package com.kreitefy.infraestructure.rest.auth;

import com.kreitefy.application.dto.LoginDto;
import com.kreitefy.application.dto.UserDto;
import com.kreitefy.application.service.AuthService;
import com.kreitefy.domain.entity.Canciones;
import com.kreitefy.domain.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthController(AuthService authService, JwtService jwtService,
        PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }



    @PostMapping(value = "/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginDto loginDto) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
            loginDto.getUsername(), loginDto.getPassword()));
        UserDto user = authService.getUser(loginDto.getUsername()).orElseThrow();
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping(value = "/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserDto userDto) {
        // En la base de datos no queremos guardar la contraseña, generamos
        // un hash.
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        UserDto userDtoRegistered = authService.register(userDto);
        String token = jwtService.generateToken(userDtoRegistered);
        return ResponseEntity.ok(new AuthResponse(token));
    }
    @PostMapping(value = "/logout")
    public ResponseEntity<?> logout() {
        // Invalidar la sesión y eliminar el token de autenticación
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }

}



