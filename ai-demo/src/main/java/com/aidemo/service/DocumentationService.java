package com.aidemo.service;

import dev.langchain4j.model.chat.ChatLanguageModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentationService {

    private final ChatLanguageModel chatLanguageModel;

    public String generateTechnicalDocumentation(String codeContent) {
        try {
            log.info("Generating technical documentation for {} characters of code", codeContent.length());
            
            String prompt = String.format("""
                Generate comprehensive but concise technical documentation for the following source code.
                Focus on the most important aspects.
                
                The documentation should include:
                
                1. **Project Overview**
                   - Purpose and functionality (2-3 sentences)
                   - Technology stack (list)
                   - Architecture overview (brief)
                
                2. **System Architecture**
                   - High-level architecture (1-2 paragraphs)
                   - Component interactions (brief)
                
                3. **API Documentation** (if applicable)
                   - Main endpoints
                   - Request/Response formats
                
                4. **Code Structure**
                   - Directory structure (overview)
                   - Key classes and modules
                
                5. **Setup and Installation**
                   - Prerequisites
                   - Installation steps
                   - Configuration
                
                6. **Usage Examples**
                   - How to use the application
                   - Code examples
                
                Code:
                %s
                
                Format the documentation in Markdown format with proper headings, code blocks, and formatting.
                Keep it comprehensive but concise.
                """, codeContent);

            log.debug("Sending documentation request to LLM (content size: {} chars)", codeContent.length());
            String response = chatLanguageModel.generate(prompt);
            log.info("Received documentation response ({} chars)", response.length());
            
            return response;
        } catch (Exception e) {
            log.error("Error generating technical documentation", e);
            return "# Technical Documentation\n\n" +
                   "Error generating documentation: " + e.getMessage() + "\n\n" +
                   "The code analysis encountered an issue. Please try again with a smaller codebase or check the logs for details.";
        }
    }
}

