package com.aidemo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeReviewReport {
    private String overallScore;
    private String summary;
    private List<CodeIssue> issues;
    private List<ImprovementSuggestion> suggestions;
    private List<String> strengths;
}

