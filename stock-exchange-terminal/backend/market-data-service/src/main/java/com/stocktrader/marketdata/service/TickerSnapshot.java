package com.stocktrader.marketdata.service;

import com.stocktrader.common.model.AssetType;

import java.math.BigDecimal;
import java.time.Instant;

public record TickerSnapshot(
        String symbol,
        AssetType assetType,
        BigDecimal price,
        BigDecimal changeAbsolute,
        BigDecimal changePercent,
        Instant updatedAt
) {
}

