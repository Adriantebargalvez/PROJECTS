package com.kreitefy.infraestructure.mappers;

import com.kreitefy.application.dto.CancionesDto;
import com.kreitefy.application.dto.UserDto;
import com.kreitefy.domain.entity.Canciones;
import com.kreitefy.domain.entity.User;
import org.mapstruct.Mapper;

import java.util.Optional;

@Mapper(componentModel = "spring")
public abstract class UsuarioMapper {
    public abstract CancionesDto personaToPersonaDto(Canciones usuario);
    public abstract Canciones personaDtoToPersona(CancionesDto usuario);
    public Optional<CancionesDto> personaToPersonaDto(Optional<Canciones> usuario) {
        if (usuario.isPresent()) {
            return Optional.of(personaToPersonaDto(usuario.get()));
        } else {
            return Optional.empty();
        }
    }

}
