package com.stocktrader.common.events;

import com.stocktrader.common.model.AssetType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PortfolioAdjustedEvent(
        String eventId,
        String aggregateId,
        Instant occurredOn,
        String userId,
        String symbol,
        AssetType assetType,
        BigDecimal deltaQuantity,
        BigDecimal price) implements DomainEvent {

    public static final String TYPE = "PortfolioAdjusted";

    @Override
    public String type() {
        return TYPE;
    }

    public static PortfolioAdjustedEvent from(String portfolioId, String userId, String symbol, AssetType assetType,
            BigDecimal deltaQuantity, BigDecimal price) {
        return new PortfolioAdjustedEvent(
                UUID.randomUUID().toString(),
                portfolioId,
                Instant.now(),
                userId,
                symbol,
                assetType,
                deltaQuantity,
                price);
    }
}
