package com.stocktrader.tradingcommand.domain;

import com.stocktrader.common.commands.CancelOrderCommand;
import com.stocktrader.common.commands.PlaceOrderCommand;
import com.stocktrader.common.events.DomainEvent;
import com.stocktrader.common.events.OrderCancelledEvent;
import com.stocktrader.common.events.OrderPlacedEvent;
import com.stocktrader.common.model.OrderStatus;

import java.util.ArrayList;
import java.util.List;

public class OrderAggregate {

    private String orderId;
    private String userId;
    private OrderStatus status = OrderStatus.PENDING;

    public static OrderAggregate rehydrate(List<DomainEvent> events) {
        OrderAggregate aggregate = new OrderAggregate();
        events.forEach(aggregate::apply);
        return aggregate;
    }

    public List<DomainEvent> handle(PlaceOrderCommand command) {
        if (orderId != null) {
            throw new IllegalStateException("Order already exists");
        }
        if (command.orderType() == com.stocktrader.common.model.OrderType.LIMIT && command.limitPrice() == null) {
            throw new IllegalArgumentException("Limit orders require a limit price");
        }
        List<DomainEvent> events = new ArrayList<>();
        events.add(OrderPlacedEvent.from(
                command.aggregateId(),
                command.userId(),
                command.symbol(),
                command.assetType(),
                command.side(),
                command.orderType(),
                command.quantity(),
                command.limitPrice()
        ));
        return events;
    }

    public List<DomainEvent> handle(CancelOrderCommand command) {
        if (orderId == null) {
            throw new IllegalStateException("Order not found");
        }
        if (status == OrderStatus.FILLED || status == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Cannot cancel order in status " + status);
        }
        return List.of(OrderCancelledEvent.from(orderId, "Cancelled by user"));
    }

    public void apply(DomainEvent event) {
        if (event instanceof OrderPlacedEvent placed) {
            this.orderId = placed.aggregateId();
            this.userId = placed.userId();
            this.status = OrderStatus.PENDING;
        } else if (event instanceof OrderCancelledEvent) {
            this.status = OrderStatus.CANCELLED;
        }
    }

    public String getOrderId() {
        return orderId;
    }

    public String getUserId() {
        return userId;
    }

    public OrderStatus getStatus() {
        return status;
    }
}

