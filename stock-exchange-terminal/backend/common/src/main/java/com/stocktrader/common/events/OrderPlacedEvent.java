package com.stocktrader.common.events;

import com.stocktrader.common.model.AssetType;
import com.stocktrader.common.model.OrderSide;
import com.stocktrader.common.model.OrderType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OrderPlacedEvent(
        String eventId,
        String aggregateId,
        Instant occurredOn,
        String userId,
        String symbol,
        AssetType assetType,
        OrderSide side,
        OrderType orderType,
        BigDecimal quantity,
        BigDecimal limitPrice) implements DomainEvent {

    public static final String TYPE = "OrderPlaced";

    @Override
    public String type() {
        return TYPE;
    }

    public static OrderPlacedEvent from(String orderId, String userId, String symbol, AssetType assetType,
            OrderSide side, OrderType orderType, BigDecimal quantity,
            BigDecimal limitPrice) {
        return new OrderPlacedEvent(
                UUID.randomUUID().toString(),
                orderId,
                Instant.now(),
                userId,
                symbol,
                assetType,
                side,
                orderType,
                quantity,
                limitPrice);
    }
}
