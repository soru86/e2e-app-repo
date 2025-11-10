package com.stocktrader.tradingcommand.service;

import com.stocktrader.common.commands.CancelOrderCommand;
import com.stocktrader.common.commands.PlaceOrderCommand;
import com.stocktrader.common.events.DomainEvent;
import com.stocktrader.common.util.EventEnvelope;
import com.stocktrader.common.util.EventStore;
import com.stocktrader.tradingcommand.domain.OrderAggregate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderCommandService {

    private final EventStore eventStore;

    public OrderCommandService(EventStore eventStore) {
        this.eventStore = eventStore;
    }

    @Transactional
    public List<EventEnvelope> handle(PlaceOrderCommand command) {
        List<DomainEvent> pastEvents = eventStore.loadEvents(command.aggregateId());
        OrderAggregate aggregate = OrderAggregate.rehydrate(pastEvents);
        List<DomainEvent> newEvents = aggregate.handle(command);
        return persistEvents(newEvents);
    }

    @Transactional
    public List<EventEnvelope> handle(CancelOrderCommand command) {
        List<DomainEvent> pastEvents = eventStore.loadEvents(command.orderId());
        OrderAggregate aggregate = OrderAggregate.rehydrate(pastEvents);
        List<DomainEvent> newEvents = aggregate.handle(command);
        return persistEvents(newEvents);
    }

    private List<EventEnvelope> persistEvents(List<DomainEvent> events) {
        List<EventEnvelope> envelopes = new ArrayList<>();
        for (DomainEvent event : events) {
            envelopes.add(eventStore.append(event));
        }
        return envelopes;
    }
}

