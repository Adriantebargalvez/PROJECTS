package com.kreitek.rrhh.usuarios.infraestructura.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.util.Set;

@Component
public class WriteRoleInterceptor implements HandlerInterceptor {
    private static final Set<String> WRITE_METHODS = Set.of("POST", "PATCH", "DELETE");
    private static final Set<String> ALLOWED_ROLES = Set.of("ADMIN", "RRHH");

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        if (!WRITE_METHODS.contains(request.getMethod())) {
            return true;
        }

        String roleHeader = request.getHeader("X-User-Role");

        if (roleHeader != null && ALLOWED_ROLES.contains(roleHeader.toUpperCase())) {
            return true;
        }

        response.sendError(
                HttpServletResponse.SC_FORBIDDEN,
                "Operation not allowed for the current role"
        );
        return false;
    }
}
