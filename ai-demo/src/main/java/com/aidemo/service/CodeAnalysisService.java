package com.aidemo.service;

import com.aidemo.dto.CodeIssue;
import com.aidemo.dto.CodeReviewReport;
import com.aidemo.dto.ImprovementSuggestion;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.model.chat.ChatLanguageModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class CodeAnalysisService {

    private final ChatLanguageModel chatLanguageModel;
    private final CodeSourceService codeSourceService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.code.max-content-size:50000}")
    private int maxContentSize;

    @Value("${app.code.max-files:50}")
    private int maxFiles;

    @Value("${app.code.max-file-size:10000}")
    private int maxFileSize;

    public String extractCodeContent(Path codePath) throws IOException {
        StringBuilder content = new StringBuilder();
        int fileCount = 0;
        int totalSize = 0;
        
        try (Stream<Path> paths = Files.walk(codePath)) {
            List<Path> codeFiles = paths
                    .filter(Files::isRegularFile)
                    .filter(path -> isCodeFile(path))
                    .filter(path -> !isIgnoredFile(path))
                    .sorted()
                    .toList();
            
            for (Path path : codeFiles) {
                if (fileCount >= maxFiles || totalSize >= maxContentSize) {
                    log.info("Reached limit: {} files or {} characters. Truncating content.", fileCount, totalSize);
                    break;
                }
                
                try {
                    String relativePath = codePath.relativize(path).toString();
                    String fileContent = Files.readString(path);
                    
                    // Limit individual file size
                    if (fileContent.length() > maxFileSize) {
                        log.debug("Truncating large file {} from {} to {} characters", 
                                relativePath, fileContent.length(), maxFileSize);
                        fileContent = fileContent.substring(0, maxFileSize) + "\n... [truncated]";
                    }
                    
                    String fileSection = "\n=== File: " + relativePath + " ===\n" + fileContent + "\n";
                    
                    // Check if adding this file would exceed the limit
                    if (totalSize + fileSection.length() > maxContentSize) {
                        int remaining = maxContentSize - totalSize;
                        if (remaining > 100) {
                            fileSection = fileSection.substring(0, remaining) + "\n... [content truncated]";
                            content.append(fileSection);
                        }
                        break;
                    }
                    
                    content.append(fileSection);
                    totalSize += fileSection.length();
                    fileCount++;
                } catch (IOException e) {
                    log.warn("Error reading file: {}", path, e);
                }
            }
        }
        
        log.info("Extracted {} files, {} characters of code content", fileCount, totalSize);
        return content.toString();
    }

    private boolean isIgnoredFile(Path path) {
        String fileName = path.getFileName().toString().toLowerCase();
        String pathStr = path.toString().toLowerCase();
        
        // Ignore common non-source files
        return pathStr.contains("node_modules") ||
               pathStr.contains(".git") ||
               pathStr.contains("target") ||
               pathStr.contains("build") ||
               pathStr.contains("dist") ||
               pathStr.contains(".idea") ||
               pathStr.contains(".vscode") ||
               fileName.equals("package-lock.json") ||
               fileName.equals("yarn.lock") ||
               fileName.equals("pom.xml") ||
               fileName.equals("build.gradle");
    }

    private boolean isCodeFile(Path path) {
        String fileName = path.getFileName().toString().toLowerCase();
        return fileName.endsWith(".java") ||
               fileName.endsWith(".js") ||
               fileName.endsWith(".ts") ||
               fileName.endsWith(".py") ||
               fileName.endsWith(".go") ||
               fileName.endsWith(".rs") ||
               fileName.endsWith(".cpp") ||
               fileName.endsWith(".c") ||
               fileName.endsWith(".cs") ||
               fileName.endsWith(".php") ||
               fileName.endsWith(".rb") ||
               fileName.endsWith(".swift") ||
               fileName.endsWith(".kt") ||
               fileName.endsWith(".scala") ||
               fileName.endsWith(".xml") ||
               fileName.endsWith(".yml") ||
               fileName.endsWith(".yaml") ||
               fileName.endsWith(".json") ||
               fileName.endsWith(".properties") ||
               fileName.endsWith(".md");
    }

    public CodeReviewReport performCodeReview(String codeContent) {
        try {
            log.info("Starting code review for {} characters of code", codeContent.length());
            
            String prompt = String.format("""
                Analyze the following source code and provide a comprehensive code review report in JSON format.
                Keep the response concise but thorough.
                
                The report should include:
                1. Overall score (out of 10)
                2. Summary of the codebase (2-3 sentences)
                3. List of top 10 most important issues with severity (CRITICAL, HIGH, MEDIUM, LOW), category (SECURITY, PERFORMANCE, MAINTAINABILITY, BUG), file path, line number, description, and recommendation
                4. List of top 5 improvement suggestions with area (CODE_QUALITY, ARCHITECTURE, PERFORMANCE, SECURITY), description, suggested change, and impact
                5. List of 3-5 key strengths
                
                Code:
                %s
                
                Return ONLY a valid JSON object (no markdown, no explanation):
                {
                  "overallScore": "8/10",
                  "summary": "...",
                  "issues": [
                    {
                      "severity": "HIGH",
                      "category": "SECURITY",
                      "filePath": "...",
                      "lineNumber": 42,
                      "description": "...",
                      "recommendation": "..."
                    }
                  ],
                  "suggestions": [
                    {
                      "area": "CODE_QUALITY",
                      "description": "...",
                      "suggestedChange": "...",
                      "impact": "..."
                    }
                  ],
                  "strengths": ["...", "..."]
                }
                """, codeContent);

            log.debug("Sending code review request to LLM (content size: {} chars)", codeContent.length());
            String jsonResponse = chatLanguageModel.generate(prompt);
            log.info("Received code review response ({} chars)", jsonResponse.length());
            
            return parseCodeReviewReport(jsonResponse);
        } catch (Exception e) {
            log.error("Error performing code review", e);
            return CodeReviewReport.builder()
                    .overallScore("N/A")
                    .summary("Error during code review: " + e.getMessage())
                    .issues(new ArrayList<>())
                    .suggestions(new ArrayList<>())
                    .strengths(new ArrayList<>())
                    .build();
        }
    }

    private CodeReviewReport parseCodeReviewReport(String jsonResponse) {
        try {
            // Extract JSON from markdown code blocks if present
            String cleanJson = extractJsonFromResponse(jsonResponse);
            
            JsonNode rootNode = objectMapper.readTree(cleanJson);
            
            CodeReviewReport.CodeReviewReportBuilder builder = CodeReviewReport.builder();
            
            // Parse basic fields
            builder.overallScore(rootNode.path("overallScore").asText("N/A"));
            builder.summary(rootNode.path("summary").asText("Code review completed"));
            
            // Parse issues
            List<CodeIssue> issues = new ArrayList<>();
            if (rootNode.has("issues") && rootNode.get("issues").isArray()) {
                for (JsonNode issueNode : rootNode.get("issues")) {
                    CodeIssue issue = CodeIssue.builder()
                            .severity(issueNode.path("severity").asText("MEDIUM"))
                            .category(issueNode.path("category").asText("MAINTAINABILITY"))
                            .filePath(issueNode.path("filePath").asText(""))
                            .lineNumber(issueNode.path("lineNumber").asInt(0))
                            .description(issueNode.path("description").asText(""))
                            .recommendation(issueNode.path("recommendation").asText(""))
                            .build();
                    issues.add(issue);
                }
            }
            builder.issues(issues);
            
            // Parse suggestions
            List<ImprovementSuggestion> suggestions = new ArrayList<>();
            if (rootNode.has("suggestions") && rootNode.get("suggestions").isArray()) {
                for (JsonNode suggestionNode : rootNode.get("suggestions")) {
                    ImprovementSuggestion suggestion = ImprovementSuggestion.builder()
                            .area(suggestionNode.path("area").asText("CODE_QUALITY"))
                            .description(suggestionNode.path("description").asText(""))
                            .suggestedChange(suggestionNode.path("suggestedChange").asText(""))
                            .impact(suggestionNode.path("impact").asText(""))
                            .build();
                    suggestions.add(suggestion);
                }
            }
            builder.suggestions(suggestions);
            
            // Parse strengths
            List<String> strengths = new ArrayList<>();
            if (rootNode.has("strengths") && rootNode.get("strengths").isArray()) {
                for (JsonNode strengthNode : rootNode.get("strengths")) {
                    strengths.add(strengthNode.asText());
                }
            }
            builder.strengths(strengths);
            
            return builder.build();
        } catch (Exception e) {
            log.error("Error parsing code review report", e);
            return CodeReviewReport.builder()
                    .overallScore("N/A")
                    .summary("Error parsing review: " + e.getMessage() + ". Raw response: " + jsonResponse.substring(0, Math.min(200, jsonResponse.length())))
                    .issues(new ArrayList<>())
                    .suggestions(new ArrayList<>())
                    .strengths(new ArrayList<>())
                    .build();
        }
    }

    private String extractJsonFromResponse(String response) {
        // Try to extract JSON from markdown code blocks
        String jsonStart = "```json";
        String jsonEnd = "```";
        
        int startIdx = response.indexOf(jsonStart);
        if (startIdx != -1) {
            startIdx = response.indexOf("\n", startIdx) + 1;
            int endIdx = response.indexOf(jsonEnd, startIdx);
            if (endIdx > startIdx) {
                return response.substring(startIdx, endIdx).trim();
            }
        }
        
        // Try without json marker
        startIdx = response.indexOf("```");
        if (startIdx != -1) {
            startIdx = response.indexOf("\n", startIdx) + 1;
            int endIdx = response.lastIndexOf("```");
            if (endIdx > startIdx) {
                return response.substring(startIdx, endIdx).trim();
            }
        }
        
        // Try to find JSON object boundaries
        int firstBrace = response.indexOf("{");
        int lastBrace = response.lastIndexOf("}");
        if (firstBrace != -1 && lastBrace > firstBrace) {
            return response.substring(firstBrace, lastBrace + 1);
        }
        
        return response.trim();
    }
}

