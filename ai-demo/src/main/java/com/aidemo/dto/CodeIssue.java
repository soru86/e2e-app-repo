package com.aidemo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeIssue {
    private String severity; // CRITICAL, HIGH, MEDIUM, LOW
    private String category; // SECURITY, PERFORMANCE, MAINTAINABILITY, BUG
    private String filePath;
    private Integer lineNumber;
    private String description;
    private String recommendation;
}

