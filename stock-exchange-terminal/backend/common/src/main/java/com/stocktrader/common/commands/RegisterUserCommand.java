package com.stocktrader.common.commands;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.UUID;

public record RegisterUserCommand(
        String aggregateId,
        @Email String email,
        @NotBlank String displayName,
        @NotBlank String password,
        Instant timestamp
) implements Command {

    public static RegisterUserCommand create(String email, String displayName, String password) {
        return new RegisterUserCommand(UUID.randomUUID().toString(), email, displayName, password, Instant.now());
    }
}

