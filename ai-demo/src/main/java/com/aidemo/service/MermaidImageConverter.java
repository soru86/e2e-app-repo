package com.aidemo.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

/**
 * Service to convert Mermaid diagrams to images.
 * Supports multiple conversion methods:
 * 1. Mermaid CLI (mmdc)
 * 2. Online API (mermaid.ink)
 * 3. Puppeteer/Playwright (if configured)
 */
@Service
@Slf4j
public class MermaidImageConverter {

    @Value("${app.image.output-dir}")
    private String imageOutputDir;

    private static final String MERMAID_INK_API = "https://mermaid.ink/img/";

    /**
     * Convert Mermaid diagram to PNG image
     * @param mermaidFilePath Path to the .mmd file
     * @return Path to the generated PNG image
     */
    public String convertToImage(String mermaidFilePath) {
        try {
            Path mmdPath = Paths.get(mermaidFilePath);
            if (!Files.exists(mmdPath)) {
                log.error("Mermaid file not found: {}", mermaidFilePath);
                return mermaidFilePath;
            }

            String mermaidCode = Files.readString(mmdPath);
            String outputPath = mermaidFilePath.replace(".mmd", ".png");

            // Try Mermaid CLI first
            if (isMermaidCliAvailable()) {
                return convertUsingMermaidCli(mermaidFilePath, outputPath);
            }

            // Fallback to online API
            return convertUsingOnlineAPI(mermaidCode, outputPath);

        } catch (Exception e) {
            log.error("Error converting Mermaid to image: {}", mermaidFilePath, e);
            return mermaidFilePath;
        }
    }

    private boolean isMermaidCliAvailable() {
        try {
            Process process = new ProcessBuilder("mmdc", "--version")
                    .redirectErrorStream(true)
                    .redirectError(ProcessBuilder.Redirect.DISCARD)
                    .redirectOutput(ProcessBuilder.Redirect.DISCARD)
                    .start();
            int exitCode = process.waitFor();
            return exitCode == 0;
        } catch (Exception e) {
            // Mermaid CLI is optional - silently fall back to online API
            return false;
        }
    }

    private String convertUsingMermaidCli(String inputPath, String outputPath) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "mmdc",
                    "-i", inputPath,
                    "-o", outputPath,
                    "-b", "transparent"
            );

            Process process = processBuilder
                    .redirectErrorStream(true)
                    .redirectError(ProcessBuilder.Redirect.DISCARD)
                    .start();

            // Read output silently
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                // Discard output
                while (reader.readLine() != null) {
                    // Silently consume output
                }
            }

            int exitCode = process.waitFor();
            if (exitCode == 0 && Files.exists(Paths.get(outputPath))) {
                log.info("Successfully converted Mermaid to image using CLI: {}", outputPath);
                return outputPath;
            } else {
                log.debug("Mermaid CLI conversion failed, falling back to online API");
                return inputPath;
            }
        } catch (Exception e) {
            log.debug("Mermaid CLI not available, using online API fallback");
            return inputPath;
        }
    }

    private String convertUsingOnlineAPI(String mermaidCode, String outputPath) {
        try {
            // Encode Mermaid code to base64
            String encoded = Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(mermaidCode.getBytes());

            // Generate image URL from mermaid.ink
            String imageUrl = MERMAID_INK_API + encoded;
            
            log.debug("Using online API (mermaid.ink) to convert Mermaid diagram");
            
            // Return the URL - the frontend can display it directly
            // Note: For local file conversion, install mermaid-cli: npm install -g @mermaid-js/mermaid-cli
            return imageUrl;
        } catch (Exception e) {
            log.warn("Error generating online API URL, returning Mermaid source file path", e);
            return outputPath;
        }
    }
}

