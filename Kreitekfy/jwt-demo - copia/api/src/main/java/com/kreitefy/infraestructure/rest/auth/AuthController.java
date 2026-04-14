package com.kreitefy.infraestructure.rest.auth;

import com.kreitefy.application.dto.GoogleUserProfile;
import com.kreitefy.application.dto.LoginDto;
import com.kreitefy.application.dto.UserDto;
import com.kreitefy.application.service.AuthService;
import com.kreitefy.application.service.GoogleIdTokenService;
import com.kreitefy.domain.entity.Role;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.NOT_IMPLEMENTED;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private static final String DEMO_USERNAME = "invitado-demo";
    private static final String DEMO_EMAIL = "demo@kreitekfy.local";
    private static final String DEMO_PASSWORD = "demo-access-only";


    private final AuthService authService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final GoogleIdTokenService googleIdTokenService;

    public AuthController(
        AuthService authService,
        JwtService jwtService,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        GoogleIdTokenService googleIdTokenService
    ) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.googleIdTokenService = googleIdTokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginDto loginDto) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
            loginDto.getUsername(),
            loginDto.getPassword()
        ));

        UserDto user = authService.getUser(loginDto.getUsername()).orElseThrow();
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserDto userDto) {
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        UserDto userDtoRegistered = authService.register(userDto);
        String token = jwtService.generateToken(userDtoRegistered);
        return ResponseEntity.ok(new AuthResponse(token, userDtoRegistered));
    }

    @PostMapping("/demo")
    public ResponseEntity<AuthResponse> loginAsDemo() {
        UserDto user = authService.getUser(DEMO_USERNAME)
            .or(() -> authService.getUserByEmail(DEMO_EMAIL))
            .orElseGet(this::createDemoUser);

        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    @GetMapping("/google/config")
    public ResponseEntity<GoogleAuthConfigResponse> getGoogleConfig() {
        return ResponseEntity.ok(new GoogleAuthConfigResponse(
            googleIdTokenService.isEnabled(),
            googleIdTokenService.getClientId()
        ));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> loginWithGoogle(@RequestBody GoogleAuthRequest request) {
        if (!googleIdTokenService.isEnabled()) {
            throw new ResponseStatusException(NOT_IMPLEMENTED, "Google login is not configured");
        }

        try {
            GoogleUserProfile profile = googleIdTokenService.verify(request.getCredential());
            UserDto user = authService.getUserByEmail(profile.getEmail())
                .orElseGet(() -> createGoogleUser(profile));
            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(new AuthResponse(token, user));
        } catch (Exception exception) {
            throw new ResponseStatusException(UNAUTHORIZED, "Google account could not be validated", exception);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }

    private UserDto createGoogleUser(GoogleUserProfile profile) {
        UserDto userDto = new UserDto();
        userDto.setUsername(resolveUsername(profile));
        userDto.setPassword(passwordEncoder.encode("google:" + profile.getSubject()));
        userDto.setFirstName(profile.getFirstName());
        userDto.setLastName(profile.getLastName());
        userDto.setEmail(profile.getEmail());
        userDto.setRole(Role.USER);
        return authService.register(userDto);
    }

    private String resolveUsername(GoogleUserProfile profile) {
        String preferredUsername = profile.getEmail();
        UserDto existingUser = authService.getUser(preferredUsername).orElse(null);

        if (existingUser == null || preferredUsername.equalsIgnoreCase(existingUser.getEmail())) {
            return preferredUsername;
        }

        return "google_" + profile.getSubject();
    }

    private UserDto createDemoUser() {
        UserDto userDto = new UserDto();
        userDto.setUsername(DEMO_USERNAME);
        userDto.setPassword(passwordEncoder.encode(DEMO_PASSWORD));
        userDto.setFirstName("Invitado");
        userDto.setLastName("Demo");
        userDto.setEmail(DEMO_EMAIL);
        userDto.setRole(Role.USER);
        return authService.register(userDto);
    }
}
