package com.stocktrader.identity.api;

public record AuthResponse(
        String userId,
        String email,
        String displayName,
        String token
) {
}

