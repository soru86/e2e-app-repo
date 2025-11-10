package com.stocktrader.common.commands;

import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

public record CancelOrderCommand(
        String aggregateId,
        @NotBlank String orderId,
        Instant timestamp) implements Command {
}
