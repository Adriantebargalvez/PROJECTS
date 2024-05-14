package com.kreitefy.infraestructure.rest;

import com.kreitefy.application.dto.CancionesDto;
import com.kreitefy.application.service.CancionesService;
import com.kreitefy.domain.entity.Canciones;
import com.kreitefy.infraestructure.mappers.UsuarioMapper;
import com.kreitefy.infraestructure.repository.CancionesRepository;
import com.kreitefy.infraestructure.rest.auth.AuthController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/canciones")
public class UsuarioController {
    @Autowired
    private CancionesRepository cancionesRepository;
    @Autowired
    private CancionesService cancionesService;
    private final UsuarioMapper mapper;
    private final AuthController authController;

    public UsuarioController(CancionesService cancionesService, AuthController authController,UsuarioMapper mapper) {
        this.cancionesService = cancionesService;
        this.authController = authController;
        this.mapper = mapper;

    }

    @GetMapping
    public List<Canciones> getAllUsuarios() {
        return cancionesRepository.findAll();
    }

    @GetMapping("/ultimas-canciones")
    public List<Canciones> getUltimasCanciones() {
        Pageable pageable = PageRequest.of(0, 5, Sort.by("id").descending());
        return cancionesRepository.findAll(pageable).getContent();
    }
    @GetMapping("/ultimas-canciones-por-estilo/{estilo}")
    public List<Canciones> getUltimasCancionesPorEstilo(@PathVariable String estilo) {
        Pageable pageable = PageRequest.of(0, 5, Sort.by("id").descending());
        return cancionesRepository.findByEstilo(estilo, pageable).getContent();
    }
    @GetMapping("/mas-escuchadas")
    public List<CancionesDto> getMasEscuchadas() {
        Pageable pageable = PageRequest.of(0, 5, Sort.by("reproducciones").descending());
        return cancionesRepository.findAll(pageable).getContent().stream()
                .map(cancion -> mapper.personaToPersonaDto(cancion))
                .collect(Collectors.toList());
    }

    @GetMapping("/mas-escuchadas-por-estilo/{estilo}")
    public List<Canciones> getMasEscuchadasPorEstilo(@PathVariable String estilo) {
        Pageable pageable = PageRequest.of(0, 5, Sort.by("reproducciones").descending());
        return cancionesRepository.findByEstilo(estilo, pageable).getContent();
    }
    @GetMapping("/para-ti")
    public List<CancionesDto> getParaTi() {
        // Obtener las canciones con puntuación mayor a 3 y con mayores reproducciones
        Pageable pageable = PageRequest.of(0, 5, Sort.by("reproducciones", "puntuacion").descending());
        List<Canciones> canciones = cancionesRepository.findByPuntuacionGreaterThanAndReproduccionesGreaterThan(3, 0, pageable);

        // Mapear las canciones a DTOs y devolver la lista
        return canciones.stream()
                .map(cancion -> mapper.personaToPersonaDto(cancion))
                .collect(Collectors.toList());
    }
    @GetMapping("/{id}")
    public ResponseEntity<CancionesDto> getCancionById(@PathVariable Long id) {
        Optional<Canciones> cancionOptional = cancionesRepository.findById(id);
        return cancionOptional.map(cancion -> ResponseEntity.ok(mapToDto(cancion)))
                .orElse(ResponseEntity.notFound().build());
    }

    private CancionesDto mapToDto(Canciones cancion) {
        CancionesDto dto = new CancionesDto();
        dto.setId(cancion.getId());
        dto.setImagen(cancion.getImagen());
        dto.setTitulo(cancion.getTitulo());
        dto.setArtista(cancion.getArtista());
        dto.setDuracion(cancion.getDuracion());
        dto.setAlbum(cancion.getalbum());
        dto.setEstilo(cancion.getEstilo());
        dto.setReproducciones(cancion.getReproducciones());
        dto.setPuntuacion(cancion.getPuntuacion());

        return dto;
    }

    @CrossOrigin
    //todos los usuarios
    @GetMapping("/page")
    public  ResponseEntity<Page<CancionesDto>> getAll(@RequestParam(value = "filter",required = false) String filter, Pageable pageable) {
        Page<CancionesDto> usuarios = cancionesService.getAll(filter,pageable);
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    @PostMapping("/{id}/reproducir")
    public ResponseEntity<?> reproducirCancion(@PathVariable Long id) {
        // Buscar la canción por su ID
        Canciones cancion = cancionesRepository.findById(id).orElse(null);
        // Verificar si la canción existe
        if (cancion != null) {
            // Incrementar el contador de reproducciones
            cancion.setReproducciones(cancion.getReproducciones() + 1);
            // Guardar en la base de datos
            cancionesRepository.save(cancion);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/puntuar")
    public ResponseEntity<?> puntuarCancion(@PathVariable Long id, @RequestParam int puntuacion) {
        Optional<Canciones> cancionOptional = cancionesRepository.findById(id);
        // Verificar si la canción existe
        if (cancionOptional.isPresent()) {
            Canciones cancion = cancionOptional.get();
            if (puntuacion >= 1 && puntuacion <= 4) {
                // Actualizar la puntuación de la canción
                cancion.setPuntuacion(puntuacion);
                cancionesRepository.save(cancion);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().body("La puntuación debe estar entre 1 y 4.");
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}



