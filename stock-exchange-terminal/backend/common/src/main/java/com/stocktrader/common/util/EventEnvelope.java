package com.stocktrader.common.util;

import com.stocktrader.common.events.DomainEvent;

import java.time.Instant;
import java.util.UUID;

public record EventEnvelope(
        UUID id,
        String aggregateId,
        String type,
        String payload,
        Instant occurredOn,
        long sequence) {
    public static EventEnvelope from(DomainEvent event, String payload, long sequence) {
        return new EventEnvelope(UUID.fromString(event.eventId()), event.aggregateId(), event.type(), payload,
                event.occurredOn(), sequence);
    }
}
