package com.stocktrader.common.util;

import com.stocktrader.common.events.DomainEvent;

import java.util.List;

public interface EventStore {
    EventEnvelope append(DomainEvent event);

    List<EventEnvelope> load(String aggregateId);

    List<DomainEvent> loadEvents(String aggregateId);

    List<EventEnvelope> loadAfter(long sequence);
}
