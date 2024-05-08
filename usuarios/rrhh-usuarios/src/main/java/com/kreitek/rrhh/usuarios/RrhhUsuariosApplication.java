package com.kreitek.rrhh.usuarios;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;


@SpringBootApplication
@ComponentScan("com.kreitek.rrhh")
public class RrhhUsuariosApplication {

	public static void main(String[] args) {
		SpringApplication.run(RrhhUsuariosApplication.class, args);
	}

}
