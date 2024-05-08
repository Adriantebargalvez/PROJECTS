package com.kreitek.rrhh.usuarios.application.dto;

import java.util.Objects;

public class UsuarioDto {
    private Integer id;
    private String nombre;
    private String apellidos;
    private String email;
    private String rol;
     private String accion;

    public Integer getId() {
        return id;
    }

    public  void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getAccion() {
        return accion;
    }

    public void setAccion(String accion) {
        this.accion = accion;
    }







    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UsuarioDto that = (UsuarioDto) o;
        return id.equals(that.id) && nombre.equals(that.nombre) && apellidos.equals(that.apellidos) && email.equals(that.email) && rol.equals(that.rol)    && accion.equals(that.accion);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nombre, apellidos);
    }
}
