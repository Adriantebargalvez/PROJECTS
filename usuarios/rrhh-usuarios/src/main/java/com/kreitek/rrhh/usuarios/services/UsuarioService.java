package com.kreitek.rrhh.usuarios.services;
import com.kreitek.rrhh.usuarios.application.dto.UsuarioDto;
import com.kreitek.rrhh.usuarios.domain.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    //interfaces
    List<UsuarioDto> getAllUsuarios ();
    UsuarioDto createUsuario(UsuarioDto persona);
    void deleteUsuario(Integer id);
    Optional<UsuarioDto> getUsuario(Integer id);
    UsuarioDto updateUsuario(UsuarioDto usuarioDto);

    Page<UsuarioDto> getAll(String filter,Pageable pageable );
}
