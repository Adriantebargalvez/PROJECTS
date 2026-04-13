package com.kreitefy.application.service;

import com.kreitefy.application.dto.GoogleUserProfile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoogleIdTokenService {
    private static final String GOOGLE_JWK_SET_URI = "https://www.googleapis.com/oauth2/v3/certs";
    private static final String GOOGLE_ISSUER = "https://accounts.google.com";

    private final String clientId;
    private final JwtDecoder jwtDecoder;

    public GoogleIdTokenService(@Value("${app.auth.google-client-id:}") String clientId) {
        this.clientId = clientId == null ? "" : clientId.trim();
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(GOOGLE_JWK_SET_URI).build();
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
            JwtValidators.createDefaultWithIssuer(GOOGLE_ISSUER),
            this::validateAudience
        ));
        this.jwtDecoder = decoder;
    }

    public boolean isEnabled() {
        return !clientId.isBlank();
    }

    public String getClientId() {
        return clientId;
    }

    public GoogleUserProfile verify(String credential) {
        Jwt jwt = jwtDecoder.decode(credential);
        if (!Boolean.TRUE.equals(jwt.getClaimAsBoolean("email_verified"))) {
            throw new JwtException("Google account email is not verified");
        }

        return new GoogleUserProfile(
            jwt.getSubject(),
            getRequiredClaim(jwt, "email"),
            firstNonBlank(jwt.getClaimAsString("given_name"), jwt.getClaimAsString("name"), getRequiredClaim(jwt, "email")),
            firstNonBlank(jwt.getClaimAsString("family_name"), "")
        );
    }

    private OAuth2TokenValidatorResult validateAudience(Jwt jwt) {
        List<String> audience = jwt.getAudience();
        if (!clientId.isBlank() && audience != null && audience.contains(clientId)) {
            return OAuth2TokenValidatorResult.success();
        }

        return OAuth2TokenValidatorResult.failure(new OAuth2Error(
            "invalid_token",
            "The Google token audience does not match the configured client id",
            null
        ));
    }

    private String getRequiredClaim(Jwt jwt, String claimName) {
        String value = jwt.getClaimAsString(claimName);
        if (value == null || value.isBlank()) {
            throw new JwtException("Missing claim: " + claimName);
        }
        return value;
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return "";
    }
}
