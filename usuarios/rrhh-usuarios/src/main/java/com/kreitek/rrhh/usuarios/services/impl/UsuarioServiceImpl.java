package com.kreitek.rrhh.usuarios.services.impl;

import com.kreitek.rrhh.usuarios.application.dto.UsuarioDto;
import com.kreitek.rrhh.usuarios.domain.Usuario;
import com.kreitek.rrhh.usuarios.infraestructura.mappers.UsuarioMapper;
import com.kreitek.rrhh.usuarios.infraestructura.repository.UsuarioRepository;
import com.kreitek.rrhh.usuarios.services.UsuarioService;
import com.kreitek.rrhh.usuarios.services.exception.DuplicateUsuarioException;
import com.kreitek.rrhh.usuarios.specs.ItemSpecification;
import com.kreitek.rrhh.usuarios.specs.shared.SearchCriteriaHelper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper mapper;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, UsuarioMapper mapper) {
        this.usuarioRepository = usuarioRepository;
        this.mapper = mapper;
    }

    @Override
    public List<UsuarioDto> getAllUsuarios() {
        List<UsuarioDto> usuarios = new ArrayList<>();
        usuarioRepository.findAll().forEach(usuario -> usuarios.add(this.mapper.personaToPersonaDto(usuario)));
        return usuarios;
    }

    @Override
    public UsuarioDto createUsuario(UsuarioDto usuarioDto) {
        validateUniqueEmailForCreate(usuarioDto);

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
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return mapper.personaToPersonaDto(usuario);
    }

    @Override
    public UsuarioDto updateUsuario(UsuarioDto usuarioDto) {
        validateUniqueEmailForUpdate(usuarioDto);

        Usuario usuario = this.mapper.personaDtoToPersona(usuarioDto);
        usuario = usuarioRepository.save(usuario);

        return mapper.personaToPersonaDto(usuario);
    }

    @Override
    public Page<UsuarioDto> getAll(String filter, String quickSearch, Pageable pageable) {
        Specification<Usuario> specification = new ItemSpecification(
                SearchCriteriaHelper.fromFilterString(filter)
        );

        if (quickSearch != null && !quickSearch.isBlank()) {
            specification = specification.and(buildQuickSearchSpecification(quickSearch.trim()));
        }

        return usuarioRepository.findAll(specification, pageable).map(mapper::personaToPersonaDto);
    }

    private void validateUniqueEmailForCreate(UsuarioDto usuarioDto) {
        if (usuarioDto.getEmail() != null && usuarioRepository.existsByEmailIgnoreCase(usuarioDto.getEmail().trim())) {
            throw new DuplicateUsuarioException("Ya existe un usuario con ese email");
        }
    }

    private void validateUniqueEmailForUpdate(UsuarioDto usuarioDto) {
        if (
                usuarioDto.getId() != null
                && usuarioDto.getEmail() != null
                && usuarioRepository.existsByEmailIgnoreCaseAndIdNot(
                        usuarioDto.getEmail().trim(),
                        usuarioDto.getId()
                )
        ) {
            throw new DuplicateUsuarioException("Ya existe un usuario con ese email");
        }
    }

    private Specification<Usuario> buildQuickSearchSpecification(String quickSearch) {
        String pattern = "%" + quickSearch.toLowerCase() + "%";

        return (root, query, criteriaBuilder) -> criteriaBuilder.or(
                criteriaBuilder.like(criteriaBuilder.lower(root.get("nombre")), pattern),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("apellidos")), pattern),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), pattern),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("rol")), pattern)
        );
    }
}
