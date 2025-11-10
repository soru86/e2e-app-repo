package com.stocktrader.tradingquery.domain;

import com.stocktrader.common.model.AssetType;
import com.stocktrader.common.model.OrderSide;
import com.stocktrader.common.model.OrderStatus;
import com.stocktrader.common.model.OrderType;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "order_summary_view", indexes = {
        @Index(name = "idx_order_summary_user", columnList = "userId"),
        @Index(name = "idx_order_summary_symbol", columnList = "symbol")
})
public class OrderSummaryView {

    @Id
    private String orderId;

    @Column(nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetType assetType;

    @Column(nullable = false)
    private String symbol;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderSide side;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType orderType;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal quantity;

    @Column(precision = 19, scale = 4)
    private BigDecimal limitPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    public OrderSummaryView() {
    }

    public OrderSummaryView(String orderId, String userId, AssetType assetType, String symbol, OrderSide side, OrderType orderType,
                            BigDecimal quantity, BigDecimal limitPrice, OrderStatus status, Instant createdAt, Instant updatedAt) {
        this.orderId = orderId;
        this.userId = userId;
        this.assetType = assetType;
        this.symbol = symbol;
        this.side = side;
        this.orderType = orderType;
        this.quantity = quantity;
        this.limitPrice = limitPrice;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getOrderId() {
        return orderId;
    }

    public String getUserId() {
        return userId;
    }

    public AssetType getAssetType() {
        return assetType;
    }

    public String getSymbol() {
        return symbol;
    }

    public OrderSide getSide() {
        return side;
    }

    public OrderType getOrderType() {
        return orderType;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public BigDecimal getLimitPrice() {
        return limitPrice;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}

