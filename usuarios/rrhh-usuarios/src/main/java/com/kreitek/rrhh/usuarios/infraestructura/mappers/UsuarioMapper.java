package com.kreitek.rrhh.usuarios.infraestructura.mappers;

import com.kreitek.rrhh.usuarios.application.dto.UsuarioDto;
import com.kreitek.rrhh.usuarios.domain.Usuario;
import org.mapstruct.Mapper;

import java.util.Optional;

@Mapper(componentModel = "spring")
public abstract class UsuarioMapper {
    public abstract UsuarioDto personaToPersonaDto(Usuario usuario);
    public abstract Usuario personaDtoToPersona(UsuarioDto usuario);
    public Optional<UsuarioDto> personaToPersonaDto(Optional<Usuario> usuario) {
        if (usuario.isPresent()) {
            return Optional.of(personaToPersonaDto(usuario.get()));
        } else {
            return Optional.empty();
        }
    }

}
