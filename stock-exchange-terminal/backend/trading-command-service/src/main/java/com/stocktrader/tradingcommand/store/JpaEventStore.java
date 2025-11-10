package com.stocktrader.tradingcommand.store;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stocktrader.common.events.DomainEvent;
import com.stocktrader.common.util.EventEnvelope;
import com.stocktrader.common.util.EventMapper;
import com.stocktrader.common.util.EventStore;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Component
public class JpaEventStore implements EventStore {

    private final StoredEventRepository repository;
    private final EventMapper mapper;

    public JpaEventStore(StoredEventRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.mapper = new EventMapper(objectMapper);
    }

    @Override
    @Transactional
    public EventEnvelope append(DomainEvent event) {
        String payload = mapper.toPayload(event);
        StoredEvent stored = new StoredEvent(event.aggregateId(), event.eventId(), event.type(), payload, event.occurredOn());
        StoredEvent saved = repository.save(stored);
        return new EventEnvelope(UUID.fromString(event.eventId()), event.aggregateId(), event.type(), payload, event.occurredOn(), saved.getSequenceNumber());
    }

    @Override
    public List<EventEnvelope> load(String aggregateId) {
        return repository.findByAggregateIdOrderBySequenceNumber(aggregateId)
                .stream()
                .map(this::toEnvelope)
                .toList();
    }

    @Override
    public List<DomainEvent> loadEvents(String aggregateId) {
        return repository.findByAggregateIdOrderBySequenceNumber(aggregateId)
                .stream()
                .map(this::toDomainEvent)
                .toList();
    }

    @Override
    public List<EventEnvelope> loadAfter(long sequence) {
        return repository.findAfter(sequence)
                .stream()
                .map(this::toEnvelope)
                .toList();
    }

    public DomainEvent toDomainEvent(StoredEvent event) {
        return mapper.toEvent(toEnvelope(event));
    }

    private EventEnvelope toEnvelope(StoredEvent event) {
        return new EventEnvelope(
                UUID.fromString(event.getEventId()),
                event.getAggregateId(),
                event.getType(),
                event.getPayload(),
                event.getOccurredOn(),
                event.getSequenceNumber()
        );
    }
}

