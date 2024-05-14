package com.kreitefy.application.service.impl;



import com.kreitefy.application.dto.CancionesDto;
import com.kreitefy.application.service.CancionesService;
import com.kreitefy.domain.entity.Canciones;
import com.kreitefy.domain.entity.User;
import com.kreitefy.infraestructure.mappers.UsuarioMapper;
import com.kreitefy.infraestructure.repository.CancionesRepository;
import com.kreitefy.specs.ItemSpecification;
import com.kreitefy.specs.shared.SearchCriteriaHelper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service

public class CancionesServiceImpl implements CancionesService {
    private CancionesRepository cancionesRepository;
    private final UsuarioMapper mapper;



    public CancionesServiceImpl(CancionesRepository cancionesRepository, UsuarioMapper mapper) {
        this.cancionesRepository = cancionesRepository;
        this.mapper = mapper;


    }


     /* @Override
    public List<CancionesDto> getAllUsuarios() {
        List<CancionesDto> usuarios = new ArrayList<>();
        cancionesRepository.findAll().forEach(persona -> usuarios.add(this.mapper.personaToPersonaDto(persona)));
        return usuarios;
    }*/

    @Override
    public List<CancionesDto> getUltimasCancionesPorEstilo(String estilo) {
        List<CancionesDto> canciones = new ArrayList<>();
        cancionesRepository.findByEstilo(estilo, PageRequest.of(0, 5, Sort.by("id").descending()))
                .forEach(cancion -> canciones.add(this.mapper.personaToPersonaDto(cancion)));
        return canciones;
    }
    @Override
    public List<CancionesDto> getMasEscuchadasPorEstilo(String estilo) {
        List<CancionesDto> canciones = new ArrayList<>();
        cancionesRepository.findByEstilo(estilo, PageRequest.of(0, 5, Sort.by("reproducciones").descending()))
                .forEach(cancion -> canciones.add(this.mapper.personaToPersonaDto(cancion)));
        return canciones;
    }
    @Override
    public Page<CancionesDto> getAll(String filter, Pageable pageable) {
        ItemSpecification specification = new ItemSpecification(SearchCriteriaHelper.fromFilterString(filter));
        Page<CancionesDto> usuarios = cancionesRepository.findAll(specification, pageable).map(mapper::personaToPersonaDto);
        return usuarios;
    }



}











