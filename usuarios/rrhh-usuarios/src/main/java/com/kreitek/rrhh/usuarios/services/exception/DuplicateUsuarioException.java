package com.kreitek.rrhh.usuarios.services.exception;

public class DuplicateUsuarioException extends RuntimeException {
    public DuplicateUsuarioException(String message) {
        super(message);
    }
}
