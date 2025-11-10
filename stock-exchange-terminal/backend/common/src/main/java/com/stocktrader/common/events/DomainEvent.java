package com.stocktrader.common.events;

import java.time.Instant;

public interface DomainEvent {
    String eventId();

    String aggregateId();

    Instant occurredOn();

    String type();
}
