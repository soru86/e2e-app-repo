package com.aidemo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class AppConfig {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.upload.temp-dir}")
    private String tempDir;

    @Value("${app.image.output-dir}")
    private String imageOutputDir;

    @Bean
    public Path uploadDirectory() throws Exception {
        Path path = Paths.get(uploadDir);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
        return path;
    }

    @Bean
    public Path tempDirectory() throws Exception {
        Path path = Paths.get(tempDir);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
        return path;
    }

    @Bean
    public Path imageOutputDirectory() throws Exception {
        Path path = Paths.get(imageOutputDir);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
        return path;
    }
}

