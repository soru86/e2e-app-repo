package com.aidemo.dto;

import lombok.Data;

@Data
public class CodeAnalysisRequest {
    private String githubUrl;
    private String zipFileUrl; // For uploaded files, we'll handle MultipartFile separately
}

