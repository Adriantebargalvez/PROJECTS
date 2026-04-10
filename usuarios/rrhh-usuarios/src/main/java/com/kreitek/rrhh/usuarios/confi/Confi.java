package com.kreitek.rrhh.usuarios.confi;

import com.kreitek.rrhh.usuarios.infraestructura.security.WriteRoleInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

@Configuration
public class Confi implements WebMvcConfigurer {
    private final WriteRoleInterceptor writeRoleInterceptor;
    private final List<String> allowedOrigins;

    public Confi(
            WriteRoleInterceptor writeRoleInterceptor,
            @Value("${app.cors.allowed-origins:http://localhost:*}") String allowedOriginsProperty
    ) {
        this.writeRoleInterceptor = writeRoleInterceptor;
        this.allowedOrigins = Arrays.stream(allowedOriginsProperty.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(allowedOrigins.toArray(String[]::new))
                .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(writeRoleInterceptor)
                .addPathPatterns("/usuario", "/usuario/**");
    }
}
