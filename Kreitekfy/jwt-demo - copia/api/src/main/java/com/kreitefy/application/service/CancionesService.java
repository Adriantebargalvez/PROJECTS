package com.kreitefy.application.service;


import com.kreitefy.application.dto.CancionesDto;
import com.kreitefy.application.dto.UserDto;
import com.kreitefy.domain.entity.Canciones;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface CancionesService {
    //interfaces
    //List<CancionesDto> getAllUsuarios ();
    Page<CancionesDto> getAll(String filter,Pageable pageable );
    List<CancionesDto> getUltimasCancionesPorEstilo(String estilo);
    List<CancionesDto> getMasEscuchadasPorEstilo(String estilo);




}

