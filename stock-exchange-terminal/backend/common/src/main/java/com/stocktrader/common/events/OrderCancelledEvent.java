package com.stocktrader.common.events;

import java.time.Instant;
import java.util.UUID;

public record OrderCancelledEvent(
        String eventId,
        String aggregateId,
        Instant occurredOn,
        String reason) implements DomainEvent {

    public static final String TYPE = "OrderCancelled";

    @Override
    public String type() {
        return TYPE;
    }

    public static OrderCancelledEvent from(String orderId, String reason) {
        return new OrderCancelledEvent(UUID.randomUUID().toString(), orderId, Instant.now(), reason);
    }
}
