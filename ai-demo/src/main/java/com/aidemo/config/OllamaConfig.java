package com.aidemo.config;

import dev.langchain4j.model.ollama.OllamaChatModel;
import dev.langchain4j.model.ollama.OllamaStreamingChatModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
@Slf4j
public class OllamaConfig {

    @Value("${ollama.base-url}")
    private String baseUrl;

    @Value("${ollama.model}")
    private String model;

    @Value("${ollama.timeout}")
    private long timeout;

    @Bean
    public OllamaChatModel ollamaChatModel() {
        log.info("Initializing OllamaChatModel with baseUrl: {}, model: {}, timeout: {}ms", baseUrl, model, timeout);
        
        OllamaChatModel chatModel = OllamaChatModel.builder()
                .baseUrl(baseUrl)
                .modelName(model)
                .timeout(Duration.ofMillis(timeout))
                .build();
        
        log.info("OllamaChatModel initialized successfully with model: {}", model);
        return chatModel;
    }

    @Bean
    public OllamaStreamingChatModel ollamaStreamingChatModel() {
        log.info("Initializing OllamaStreamingChatModel with model: {}", model);
        return OllamaStreamingChatModel.builder()
                .baseUrl(baseUrl)
                .modelName(model)
                .timeout(Duration.ofMillis(timeout))
                .build();
    }
}

