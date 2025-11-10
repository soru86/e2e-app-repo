package com.stocktrader.common.events;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OrderFilledEvent(
        String eventId,
        String aggregateId,
        Instant occurredOn,
        BigDecimal fillQuantity,
        BigDecimal fillPrice,
        boolean fullyFilled) implements DomainEvent {

    public static final String TYPE = "OrderFilled";

    @Override
    public String type() {
        return TYPE;
    }

    public static OrderFilledEvent from(String orderId, BigDecimal fillQuantity, BigDecimal fillPrice,
            boolean fullyFilled) {
        return new OrderFilledEvent(UUID.randomUUID().toString(), orderId, Instant.now(), fillQuantity, fillPrice,
                fullyFilled);
    }
}
