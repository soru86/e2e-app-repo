package com.stocktrader.tradingquery.domain;

import com.stocktrader.common.model.AssetType;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "portfolio_position_view", indexes = {
        @Index(name = "idx_portfolio_user", columnList = "userId"),
        @Index(name = "idx_portfolio_symbol", columnList = "symbol")
})
public class PortfolioPositionView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String symbol;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetType assetType;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal quantity;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal averagePrice;

    public PortfolioPositionView() {
    }

    public PortfolioPositionView(String userId, String symbol, AssetType assetType, BigDecimal quantity, BigDecimal averagePrice) {
        this.userId = userId;
        this.symbol = symbol;
        this.assetType = assetType;
        this.quantity = quantity;
        this.averagePrice = averagePrice;
    }

    public Long getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getSymbol() {
        return symbol;
    }

    public AssetType getAssetType() {
        return assetType;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public BigDecimal getAveragePrice() {
        return averagePrice;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public void setAveragePrice(BigDecimal averagePrice) {
        this.averagePrice = averagePrice;
    }
}

