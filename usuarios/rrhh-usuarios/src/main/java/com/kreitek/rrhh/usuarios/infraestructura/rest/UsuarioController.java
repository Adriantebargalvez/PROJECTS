package com.kreitek.rrhh.usuarios.infraestructura.rest;

import com.kreitek.rrhh.usuarios.application.dto.UsuarioDto;
import com.kreitek.rrhh.usuarios.services.UsuarioService;
import com.kreitek.rrhh.usuarios.services.exception.DuplicateUsuarioException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class UsuarioController {
    private final HttpServletRequest request;
    private final UsuarioService usuarioService;

    public UsuarioController(HttpServletRequest request, UsuarioService usuarioService) {
        this.request = request;
        this.usuarioService = usuarioService;
    }

    @CrossOrigin
    @GetMapping("/usuario/page")
    public ResponseEntity<Page<UsuarioDto>> getAll(
            @RequestParam(value = "filter", required = false) String filter,
            @RequestParam(value = "quickSearch", required = false) String quickSearch,
            Pageable pageable
    ) {
        Page<UsuarioDto> usuarios = usuarioService.getAll(filter, quickSearch, pageable);
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/usuario")
    public ResponseEntity<List<UsuarioDto>> getUsuario() {
        if (!isJsonRequest()) {
            return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
        }

        List<UsuarioDto> usuarios = usuarioService.getAllUsuarios();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    @CrossOrigin
    @PostMapping("/usuario")
    public ResponseEntity<UsuarioDto> postUsuario(@RequestBody UsuarioDto nuevaUsuario) {
        if (!isJsonRequest()) {
            return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
        }

        try {
            UsuarioDto usuario = usuarioService.createUsuario(nuevaUsuario);
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (DuplicateUsuarioException ex) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @CrossOrigin
    @DeleteMapping("/usuario/{id}")
    public ResponseEntity<Void> deletePersona(@PathVariable Integer id) {
        try {
            usuarioService.deleteUsuario(id);
            return ResponseEntity.ok().build();
        } catch (EmptyResultDataAccessException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @CrossOrigin
    @GetMapping("/usuario/{id}")
    public ResponseEntity<UsuarioDto> getUsuario(@PathVariable Integer id) {
        if (!isJsonRequest()) {
            return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
        }

        Optional<UsuarioDto> usuario = usuarioService.getUsuario(id);

        return usuario
                .map(usuarioDto -> new ResponseEntity<>(usuarioDto, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @CrossOrigin
    @PatchMapping("/usuario/{id}")
    public ResponseEntity<UsuarioDto> updatePersona(@PathVariable Integer id, @RequestBody UsuarioDto usuarioDto) {
        if (!isJsonRequest()) {
            return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
        }

        try {
            usuarioDto.setId(id);
            UsuarioDto usuario = usuarioService.updateUsuario(usuarioDto);
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (DuplicateUsuarioException ex) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        } catch (ObjectOptimisticLockingFailureException ex) {
            return new ResponseEntity<>(HttpStatus.LOCKED);
        }
    }

    private boolean isJsonRequest() {
        String accept = request.getHeader("Accept");
        return accept != null && accept.contains("application/json");
    }
}
