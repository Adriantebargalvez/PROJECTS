package com.kreitek.rrhh.usuarios.infraestructura.rest;

import com.kreitek.rrhh.usuarios.application.dto.UsuarioDto;
import com.kreitek.rrhh.usuarios.domain.Usuario;
import com.kreitek.rrhh.usuarios.services.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController()
public class UsuarioController {
    private final HttpServletRequest request;
    private final UsuarioService usuarioService;

    // Constructor que inyecta las dependencias
    public UsuarioController(HttpServletRequest request, UsuarioService usuarioService) {
        this.request = request;
        this.usuarioService = usuarioService;
    }

    @CrossOrigin
    //todos los usuarios
    @GetMapping("/usuario/page")
public  ResponseEntity<Page<UsuarioDto>> getAll(@RequestParam(value = "filter",required = false) String filter, Pageable pageable) {
        Page<UsuarioDto> usuarios = usuarioService.getAll(filter,pageable);
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

@CrossOrigin
    //todos los usuarios
    @GetMapping("/usuario")
    public ResponseEntity<List<UsuarioDto>> getUsuario() {
        String accept = request.getHeader("Accept");
        if (accept != null && accept.contains("application/json")) {
            //todos los usuarios del servicio
            List<UsuarioDto> usuarios = usuarioService.getAllUsuarios();

            //Y los devuelve
            return new ResponseEntity<>(usuarios, HttpStatus.OK);
        }
        return new ResponseEntity<List<UsuarioDto>>(HttpStatus.NOT_IMPLEMENTED);
    }

    @CrossOrigin
    //crear un nuevo usuario
    @PostMapping("/usuario")
    public ResponseEntity<UsuarioDto> postUsuario(@RequestBody UsuarioDto nuevaUsuario) {
        String accept = request.getHeader("Accept");
        if (accept != null && accept.contains("application/json")) {
            // Crear el nuevo usuario
            UsuarioDto usuario = usuarioService.createUsuario(nuevaUsuario);
            // Y devuelve con el usuario creado
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        }
        return new ResponseEntity<UsuarioDto>(HttpStatus.NOT_IMPLEMENTED);
    }
    @CrossOrigin
    //Eliminar usuario por su id
    @DeleteMapping("/usuario/{id}")
    public ResponseEntity<Void> deletePersona(@PathVariable Integer id) {
        try {
            //elimina
            usuarioService.deleteUsuario(id);
            //devuelve
            return ResponseEntity.ok().build();
        } catch (EmptyResultDataAccessException ex) {
            //en el caso de que no exista error
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @CrossOrigin
    //usuario por su id
    @GetMapping("/usuario/{id}")
    public ResponseEntity<UsuarioDto> getUsuario(@PathVariable Integer id) {
        String accept = request.getHeader("Accept");
        if (accept != null && accept.contains("application/json")) {
            // Obtener el usuario
            Optional<UsuarioDto> usuario = usuarioService.getUsuario(id);
            if (usuario.isPresent())
                //devolver usuario
                return new ResponseEntity<>(usuario.get(), HttpStatus.OK);
            else
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }
    @CrossOrigin
    @PatchMapping("/usuario/{id}")
    public ResponseEntity<UsuarioDto> updatePersona(@PathVariable Integer id, @RequestBody UsuarioDto usuarioDto) {
        String accept = request.getHeader("Accept");
        if (accept != null && accept.contains("application/json")) {
            try {
                usuarioDto.setId(id);
                UsuarioDto persona = usuarioService.updateUsuario(usuarioDto);
                return new ResponseEntity<>(persona, HttpStatus.OK);
            } catch (ObjectOptimisticLockingFailureException ex) {
                return new ResponseEntity<>(HttpStatus.LOCKED);
            }
        }

        return new ResponseEntity<UsuarioDto>(HttpStatus.NOT_IMPLEMENTED);
    }

}




