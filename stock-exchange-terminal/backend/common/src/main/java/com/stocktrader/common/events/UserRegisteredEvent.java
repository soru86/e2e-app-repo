package com.stocktrader.common.events;

import java.time.Instant;
import java.util.UUID;

public record UserRegisteredEvent(
        String eventId,
        String aggregateId,
        Instant occurredOn,
        String email,
        String displayName) implements DomainEvent {

    public static final String TYPE = "UserRegistered";

    @Override
    public String type() {
        return TYPE;
    }

    public static UserRegisteredEvent from(String aggregateId, String email, String displayName) {
        return new UserRegisteredEvent(UUID.randomUUID().toString(), aggregateId, Instant.now(), email, displayName);
    }
}
