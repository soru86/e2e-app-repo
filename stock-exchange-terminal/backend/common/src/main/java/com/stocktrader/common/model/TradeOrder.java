package com.stocktrader.common.model;

import java.math.BigDecimal;
import java.time.Instant;

public record TradeOrder(
        String orderId,
        String userId,
        String symbol,
        AssetType assetType,
        OrderSide side,
        OrderType orderType,
        BigDecimal quantity,
        BigDecimal limitPrice,
        OrderStatus status,
        Instant createdAt) {
}
