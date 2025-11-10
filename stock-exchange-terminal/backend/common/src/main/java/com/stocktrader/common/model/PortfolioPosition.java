package com.stocktrader.common.model;

import java.math.BigDecimal;

public record PortfolioPosition(
        String symbol,
        AssetType assetType,
        BigDecimal quantity,
        BigDecimal averagePrice) {
}
