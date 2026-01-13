package com.aidemo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImprovementSuggestion {
    private String area; // CODE_QUALITY, ARCHITECTURE, PERFORMANCE, SECURITY
    private String description;
    private String suggestedChange;
    private String impact;
}

