package com.stocktrader.identity.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterUserRequest(
        @Email String email,
        @NotBlank @Size(min = 3, max = 100) String displayName,
        @NotBlank @Size(min = 8, max = 80) String password
) {
}

