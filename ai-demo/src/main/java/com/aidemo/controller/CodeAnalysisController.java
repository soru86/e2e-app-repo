package com.aidemo.controller;

import com.aidemo.dto.AnalysisResponse;
import com.aidemo.service.CodeAnalysisService;
import com.aidemo.service.CodeSourceService;
import com.aidemo.service.DocumentationService;
import com.aidemo.service.ImageGenerationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analyze")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CodeAnalysisController {

    private final CodeSourceService codeSourceService;
    private final CodeAnalysisService codeAnalysisService;
    private final DocumentationService documentationService;
    private final ImageGenerationService imageGenerationService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AnalysisResponse> analyzeZipUpload(
            @RequestParam("file") MultipartFile file) {
        
        String analysisId = UUID.randomUUID().toString();
        Path codePath = null;

        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(AnalysisResponse.builder()
                                .analysisId(analysisId)
                                .status("ERROR")
                                .message("Uploaded file is empty")
                                .build());
            }

            // Process zip file
            codePath = codeSourceService.processZipUpload(file);
            
            // Extract code content
            String codeContent = codeAnalysisService.extractCodeContent(codePath);
            
            // Generate images
            var generatedImages = imageGenerationService.generateDiagrams(codeContent);
            
            // Generate documentation
            String documentation = documentationService.generateTechnicalDocumentation(codeContent);
            
            // Perform code review
            var codeReview = codeAnalysisService.performCodeReview(codeContent);
            
            return ResponseEntity.ok(AnalysisResponse.builder()
                    .analysisId(analysisId)
                    .status("SUCCESS")
                    .message("Analysis completed successfully")
                    .generatedImages(generatedImages)
                    .documentation(documentation)
                    .codeReview(codeReview)
                    .build());

        } catch (Exception e) {
            log.error("Error analyzing code", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AnalysisResponse.builder()
                            .analysisId(analysisId)
                            .status("ERROR")
                            .message("Error analyzing code: " + e.getMessage())
                            .build());
        } finally {
            // Cleanup
            if (codePath != null) {
                codeSourceService.cleanupTempDirectory(codePath);
            }
        }
    }

    @PostMapping("/github")
    public ResponseEntity<AnalysisResponse> analyzeGitHubUrl(
            @RequestParam("url") String githubUrl) {
        
        String analysisId = UUID.randomUUID().toString();
        Path codePath = null;

        try {
            // Validate URL
            if (githubUrl == null || githubUrl.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(AnalysisResponse.builder()
                                .analysisId(analysisId)
                                .status("ERROR")
                                .message("GitHub URL is required")
                                .build());
            }

            // Process GitHub URL
            codePath = codeSourceService.processGitHubUrl(githubUrl);
            
            // Extract code content
            String codeContent = codeAnalysisService.extractCodeContent(codePath);
            
            // Generate images
            var generatedImages = imageGenerationService.generateDiagrams(codeContent);
            
            // Generate documentation
            String documentation = documentationService.generateTechnicalDocumentation(codeContent);
            
            // Perform code review
            var codeReview = codeAnalysisService.performCodeReview(codeContent);
            
            return ResponseEntity.ok(AnalysisResponse.builder()
                    .analysisId(analysisId)
                    .status("SUCCESS")
                    .message("Analysis completed successfully")
                    .generatedImages(generatedImages)
                    .documentation(documentation)
                    .codeReview(codeReview)
                    .build());

        } catch (Exception e) {
            log.error("Error analyzing GitHub repository", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AnalysisResponse.builder()
                            .analysisId(analysisId)
                            .status("ERROR")
                            .message("Error analyzing GitHub repository: " + e.getMessage())
                            .build());
        } finally {
            // Cleanup
            if (codePath != null) {
                codeSourceService.cleanupTempDirectory(codePath);
            }
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Service is running");
    }
}

