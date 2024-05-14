package com.kreitefy.infraestructure.rest;

import com.kreitefy.domain.entity.Canciones;
import com.kreitefy.domain.entity.Puntuacion;
import com.kreitefy.domain.entity.User;
import com.kreitefy.infraestructure.repository.CancionesRepository;
import com.kreitefy.infraestructure.repository.PuntuacionRepository;
import com.kreitefy.infraestructure.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

public class PuntuacionController { private final PuntuacionRepository puntuacionRepository;

    private final UserRepository userRepository;
    private final CancionesRepository cancionesRepository;


    public PuntuacionController(PuntuacionRepository puntuacionRepository, UserRepository userRepository, CancionesRepository cancionesRepository) {
        this.puntuacionRepository = puntuacionRepository;
        this.userRepository = userRepository;
        this.cancionesRepository = cancionesRepository;
    }

    @PostMapping("/guardarPuntuacion")
    public String guardarPuntuacion(@RequestParam Long userId, @RequestParam Long cancionId, @RequestParam int puntuacion) {
        User user = userRepository.findById(userId).orElse(null);
        Canciones canciones = cancionesRepository.findById(cancionId).orElse(null);
        if (user != null && canciones != null) {
            Puntuacion nuevaPuntuacion = new Puntuacion();
            nuevaPuntuacion.setUser(user);
            nuevaPuntuacion.setCanciones(canciones);
            nuevaPuntuacion.setPuntuacion(puntuacion);
            puntuacionRepository.save(nuevaPuntuacion);
        }
        return "redirect:/";
    }

}
