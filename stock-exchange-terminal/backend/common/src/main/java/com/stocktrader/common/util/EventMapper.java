package com.stocktrader.common.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stocktrader.common.events.*;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;

public class EventMapper {

    private final ObjectMapper objectMapper;
    private final Map<String, Function<String, DomainEvent>> registry = new ConcurrentHashMap<>();

    public EventMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        registerDefaults();
    }

    private void registerDefaults() {
        register(UserRegisteredEvent.TYPE, payload -> read(payload, UserRegisteredEvent.class));
        register(OrderPlacedEvent.TYPE, payload -> read(payload, OrderPlacedEvent.class));
        register(OrderCancelledEvent.TYPE, payload -> read(payload, OrderCancelledEvent.class));
        register(OrderFilledEvent.TYPE, payload -> read(payload, OrderFilledEvent.class));
        register(PortfolioAdjustedEvent.TYPE, payload -> read(payload, PortfolioAdjustedEvent.class));
    }

    public void register(String type, Function<String, DomainEvent> factory) {
        registry.put(type, factory);
    }

    public DomainEvent toEvent(EventEnvelope envelope) {
        return Optional.ofNullable(registry.get(envelope.type()))
                .map(factory -> factory.apply(envelope.payload()))
                .orElseThrow(() -> new IllegalArgumentException("Unknown event type: " + envelope.type()));
    }

    public String toPayload(DomainEvent event) {
        try {
            return objectMapper.writeValueAsString(event);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize event", e);
        }
    }

    private <T extends DomainEvent> T read(String payload, Class<T> type) {
        try {
            return objectMapper.readValue(payload, type);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to deserialize event payload", e);
        }
    }
}
