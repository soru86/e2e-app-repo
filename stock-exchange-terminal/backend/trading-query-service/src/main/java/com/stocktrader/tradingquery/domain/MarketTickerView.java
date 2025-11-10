package com.stocktrader.tradingquery.domain;

import com.stocktrader.common.model.AssetType;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "market_ticker_view")
public class MarketTickerView {

    @Id
    private String symbol;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetType assetType;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal lastPrice;

    @Column(precision = 19, scale = 4)
    private BigDecimal changeAbsolute;

    @Column(precision = 10, scale = 4)
    private BigDecimal changePercent;

    @Column(nullable = false)
    private Instant updatedAt;

    public MarketTickerView() {
    }

    public MarketTickerView(String symbol, AssetType assetType, BigDecimal lastPrice, BigDecimal changeAbsolute,
                            BigDecimal changePercent, Instant updatedAt) {
        this.symbol = symbol;
        this.assetType = assetType;
        this.lastPrice = lastPrice;
        this.changeAbsolute = changeAbsolute;
        this.changePercent = changePercent;
        this.updatedAt = updatedAt;
    }

    public String getSymbol() {
        return symbol;
    }

    public AssetType getAssetType() {
        return assetType;
    }

    public BigDecimal getLastPrice() {
        return lastPrice;
    }

    public BigDecimal getChangeAbsolute() {
        return changeAbsolute;
    }

    public BigDecimal getChangePercent() {
        return changePercent;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setLastPrice(BigDecimal lastPrice) {
        this.lastPrice = lastPrice;
    }

    public void setChangeAbsolute(BigDecimal changeAbsolute) {
        this.changeAbsolute = changeAbsolute;
    }

    public void setChangePercent(BigDecimal changePercent) {
        this.changePercent = changePercent;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}

