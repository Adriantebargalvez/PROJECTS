package com.generatevideos.tiktok;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class GenerateVideosTiktokApplication {

    public static void main(String[] args) {
        SpringApplication.run(GenerateVideosTiktokApplication.class, args);
    }
}
