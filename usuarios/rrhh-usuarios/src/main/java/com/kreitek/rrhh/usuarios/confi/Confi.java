package com.kreitek.rrhh.usuarios.confi;
import com.kreitek.rrhh.usuarios.infraestructura.security.WriteRoleInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class Confi implements WebMvcConfigurer {
    private final WriteRoleInterceptor writeRoleInterceptor;

    public Confi(WriteRoleInterceptor writeRoleInterceptor) {
        this.writeRoleInterceptor = writeRoleInterceptor;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("http://localhost:*")
                .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(writeRoleInterceptor)
                .addPathPatterns("/usuario", "/usuario/**");
    }
}
