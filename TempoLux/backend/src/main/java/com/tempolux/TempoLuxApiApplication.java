package com.tempolux;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TempoLuxApiApplication {

  // Punto de entrada del servidor — arranca el API REST que sirve /api/watches al frontend Angular
  public static void main(String[] args) {
    SpringApplication.run(TempoLuxApiApplication.class, args);
  }
}
