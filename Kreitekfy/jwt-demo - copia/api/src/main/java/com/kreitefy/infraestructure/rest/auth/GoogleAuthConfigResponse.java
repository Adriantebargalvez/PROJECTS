package com.kreitefy.infraestructure.rest.auth;

public class GoogleAuthConfigResponse {
    private final boolean enabled;
    private final String clientId;

    public GoogleAuthConfigResponse(boolean enabled, String clientId) {
        this.enabled = enabled;
        this.clientId = clientId;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public String getClientId() {
        return clientId;
    }
}
