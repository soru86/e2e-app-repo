package com.stocktrader.common.commands;

import com.stocktrader.common.model.AssetType;
import com.stocktrader.common.model.OrderSide;
import com.stocktrader.common.model.OrderType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PlaceOrderCommand(
        String aggregateId,
        @NotBlank String userId,
        @NotBlank String symbol,
        @NotNull AssetType assetType,
        @NotNull OrderSide side,
        @NotNull OrderType orderType,
        @Positive BigDecimal quantity,
        BigDecimal limitPrice,
        Instant timestamp) implements Command {

    public static PlaceOrderCommand create(String userId, String symbol, AssetType assetType,
            OrderSide side, OrderType orderType, BigDecimal quantity,
            BigDecimal limitPrice) {
        return new PlaceOrderCommand(
                UUID.randomUUID().toString(),
                userId,
                symbol,
                assetType,
                side,
                orderType,
                quantity,
                limitPrice,
                Instant.now());
    }
}
