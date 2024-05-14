package com.kreitefy.domain.entity;


import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "Canciones", uniqueConstraints = {@UniqueConstraint(columnNames = "titulo")})

public class Canciones {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length =100, nullable = false)
    private String titulo;

    @Column(length =255, nullable = false)
    private String artista;

    @Column(length =255, nullable = false)
    private String estilo;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String imagen;

    @Column(length =255, nullable = false)
    private String album;

    @Column(length =80, nullable = false)
    private String duracion;

    @Column(nullable = false)
    private Integer reproducciones;

    @Column(nullable = false)
    private int puntuacion;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }


    public String getEstilo() {
        return estilo;
    }

    public void setEstilo(String estilo) {
        this.estilo = estilo;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getArtista() {
        return artista;
    }

    public void setArtista(String artista) {
        this.artista = artista;
    }

    public String getalbum() {
        return album;
    }

    public void setAlbum(String album) {
        this.album = album;
    }
    public String getDuracion() {
        return duracion;
    }

    public void setDuracion(String duracion) {
        this.duracion = duracion;
    }

    public Integer getReproducciones() {
        return reproducciones;
    }

    public void setReproducciones(Integer reproducciones) {
        this.reproducciones = reproducciones;
    }
    public int getPuntuacion() {
        return puntuacion;
    }

    public void setPuntuacion(int puntuacion) {
        this.puntuacion = puntuacion;
    }

}


