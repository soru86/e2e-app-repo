package com.stocktrader.tradingcommand.api;

import com.stocktrader.common.model.AssetType;
import com.stocktrader.common.model.OrderSide;
import com.stocktrader.common.model.OrderType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record PlaceOrderRequest(
        @NotBlank String userId,
        @NotBlank String symbol,
        @NotNull AssetType assetType,
        @NotNull OrderSide side,
        @NotNull OrderType orderType,
        @Positive BigDecimal quantity,
        BigDecimal limitPrice
) {
}

