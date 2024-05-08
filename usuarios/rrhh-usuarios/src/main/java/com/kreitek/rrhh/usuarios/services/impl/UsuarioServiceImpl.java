package com.kreitek.rrhh.usuarios.services.impl;

import com.kreitek.rrhh.usuarios.application.dto.UsuarioDto;
import com.kreitek.rrhh.usuarios.domain.Usuario;



import com.kreitek.rrhh.usuarios.infraestructura.mappers.UsuarioMapper;
import com.kreitek.rrhh.usuarios.infraestructura.repository.UsuarioRepository;
import com.kreitek.rrhh.usuarios.services.UsuarioService;

import com.kreitek.rrhh.usuarios.specs.ItemSpecification;
import com.kreitek.rrhh.usuarios.specs.shared.SearchCriteriaHelper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service

public class UsuarioServiceImpl implements UsuarioService {
    private UsuarioRepository usuarioRepository;
    private final UsuarioMapper mapper;


    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, UsuarioMapper mapper) {
        this.usuarioRepository = usuarioRepository;
        this.mapper = mapper;

    }

    //implementaciones
    @Override
    public List<UsuarioDto> getAllUsuarios() {
        List<UsuarioDto> usuarios = new ArrayList<>();
        usuarioRepository.findAll().forEach(persona -> usuarios.add(this.mapper.personaToPersonaDto(persona)));
        return usuarios;
    }

    @Override
    public UsuarioDto createUsuario(UsuarioDto usuarioDto) {
        Usuario usuario = this.mapper.personaDtoToPersona(usuarioDto);

        usuario = usuarioRepository.save(usuario);

        return this.mapper.personaToPersonaDto(usuario);
    }


    @Override
    public void deleteUsuario(Integer id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public Optional<UsuarioDto> getUsuario(Integer id) {
        Optional<Usuario> persona = usuarioRepository.findById(id);
        return mapper.personaToPersonaDto(persona);
    }

    @Override
    public UsuarioDto updateUsuario(UsuarioDto usuarioDto) {
        Usuario persona = this.mapper.personaDtoToPersona(usuarioDto);
        persona = usuarioRepository.save(persona);
        return mapper.personaToPersonaDto(persona);
    }



    @Override
    public Page<UsuarioDto> getAll(String filter, Pageable pageable) {
        ItemSpecification specification = new ItemSpecification(SearchCriteriaHelper.fromFilterString(filter));
        Page<UsuarioDto> usuarios = usuarioRepository.findAll(specification, pageable).map(mapper::personaToPersonaDto);
        return usuarios;
    }




    }






