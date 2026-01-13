package com.aidemo.service;

import dev.langchain4j.model.chat.ChatLanguageModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageGenerationService {

    private final ChatLanguageModel chatLanguageModel;
    private final MermaidImageConverter mermaidImageConverter;

    @Value("${app.image.output-dir}")
    private String imageOutputDir;

    public List<String> generateDiagrams(String codeContent) throws IOException {
        List<String> generatedImages = new ArrayList<>();

        // Generate Flowchart
        String flowchart = generateFlowchart(codeContent);
        String flowchartPath = saveMermaidDiagram(flowchart, "flowchart");
        String flowchartImage = mermaidImageConverter.convertToImage(flowchartPath);
        generatedImages.add(flowchartImage);

        // Generate Sequence Diagram
        String sequenceDiagram = generateSequenceDiagram(codeContent);
        String sequencePath = saveMermaidDiagram(sequenceDiagram, "sequence");
        String sequenceImage = mermaidImageConverter.convertToImage(sequencePath);
        generatedImages.add(sequenceImage);

        // Generate Architecture Diagram
        String architectureDiagram = generateArchitectureDiagram(codeContent);
        String architecturePath = saveMermaidDiagram(architectureDiagram, "architecture");
        String architectureImage = mermaidImageConverter.convertToImage(architecturePath);
        generatedImages.add(architectureImage);

        return generatedImages;
    }

    private String generateFlowchart(String codeContent) {
        try {
            log.debug("Generating flowchart for {} characters of code", codeContent.length());
            
            String prompt = String.format("""
                Analyze the following source code and generate a concise Mermaid flowchart diagram.
                Focus on the main flow: entry points, key decisions, and process flows.
                Keep the diagram simple and clear (max 20 nodes).
                
                Code:
                %s
                
                Return ONLY the Mermaid flowchart code (flowchart TD or flowchart LR), no markdown, no explanation.
                """, codeContent);

            String response = chatLanguageModel.generate(prompt);
            String mermaidCode = extractMermaidCode(response);
            return mermaidCode;
        } catch (Exception e) {
            log.error("Error generating flowchart", e);
            return "flowchart TD\n    A[Error generating flowchart]";
        }
    }

    private String generateSequenceDiagram(String codeContent) {
        try {
            log.debug("Generating sequence diagram for {} characters of code", codeContent.length());
            
            String prompt = String.format("""
                Analyze the following source code and generate a concise Mermaid sequence diagram.
                Focus on main component interactions and method calls (max 10 participants).
                
                Code:
                %s
                
                Return ONLY the Mermaid sequence diagram code (sequenceDiagram), no markdown, no explanation.
                """, codeContent);

            String response = chatLanguageModel.generate(prompt);
            String mermaidCode = extractMermaidCode(response);
            return mermaidCode;
        } catch (Exception e) {
            log.error("Error generating sequence diagram", e);
            return "sequenceDiagram\n    participant A\n    A->>A: Error generating diagram";
        }
    }

    private String generateArchitectureDiagram(String codeContent) {
        try {
            log.debug("Generating architecture diagram for {} characters of code", codeContent.length());
            
            String prompt = String.format("""
                Analyze the following source code and generate a concise Mermaid architecture diagram.
                Show system architecture, main components, and their relationships (max 15 nodes).
                
                Code:
                %s
                
                Return ONLY the Mermaid graph code (graph TD or graph LR), no markdown, no explanation.
                """, codeContent);

            String response = chatLanguageModel.generate(prompt);
            String mermaidCode = extractMermaidCode(response);
            return mermaidCode;
        } catch (Exception e) {
            log.error("Error generating architecture diagram", e);
            return "graph TD\n    A[Error generating diagram]";
        }
    }

    private String extractMermaidCode(String response) {
        // Extract Mermaid code from markdown code blocks
        String startMarker = "```mermaid";
        String endMarker = "```";
        
        int startIdx = response.indexOf(startMarker);
        if (startIdx == -1) {
            // Try without mermaid marker
            startIdx = response.indexOf("```");
            if (startIdx != -1) {
                startIdx = response.indexOf("\n", startIdx) + 1;
            }
        } else {
            startIdx = response.indexOf("\n", startIdx) + 1;
        }
        
        int endIdx = response.lastIndexOf(endMarker);
        if (endIdx == -1) {
            endIdx = response.length();
        }
        
        if (startIdx > 0 && endIdx > startIdx) {
            return response.substring(startIdx, endIdx).trim();
        }
        
        // Fallback: return the response as-is if no markers found
        return response.trim();
    }

    private String saveMermaidDiagram(String mermaidCode, String diagramType) throws IOException {
        String fileName = String.format("%s_%s.mmd", diagramType, UUID.randomUUID().toString());
        Path filePath = Paths.get(imageOutputDir, fileName);
        
        // Ensure directory exists
        Files.createDirectories(filePath.getParent());
        
        // Save Mermaid code
        Files.writeString(filePath, mermaidCode);
        
        // Note: In production, you would convert Mermaid to image using:
        // 1. Mermaid CLI (mermaid-cli)
        // 2. Puppeteer/Playwright
        // 3. Online API (mermaid.ink)
        // For now, we'll save the Mermaid code and return the path
        
        return filePath.toString();
    }

}

