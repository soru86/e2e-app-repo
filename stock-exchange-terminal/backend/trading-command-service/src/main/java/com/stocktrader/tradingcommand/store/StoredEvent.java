package com.stocktrader.tradingcommand.store;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "stored_events", indexes = {
        @Index(name = "idx_stored_events_aggregate", columnList = "aggregateId"),
        @Index(name = "idx_stored_events_type", columnList = "type")
})
public class StoredEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sequenceNumber;

    @Column(nullable = false)
    private String aggregateId;

    @Column(nullable = false, unique = true)
    private String eventId;

    @Column(nullable = false)
    private String type;

    @Lob
    @Column(nullable = false)
    private String payload;

    @Column(nullable = false)
    private Instant occurredOn;

    protected StoredEvent() {
    }

    public StoredEvent(String aggregateId, String eventId, String type, String payload, Instant occurredOn) {
        this.aggregateId = aggregateId;
        this.eventId = eventId;
        this.type = type;
        this.payload = payload;
        this.occurredOn = occurredOn;
    }

    public Long getSequenceNumber() {
        return sequenceNumber;
    }

    public String getAggregateId() {
        return aggregateId;
    }

    public String getEventId() {
        return eventId;
    }

    public String getType() {
        return type;
    }

    public String getPayload() {
        return payload;
    }

    public Instant getOccurredOn() {
        return occurredOn;
    }
}

