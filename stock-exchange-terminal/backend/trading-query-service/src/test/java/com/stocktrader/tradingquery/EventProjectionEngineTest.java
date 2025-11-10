package com.stocktrader.tradingquery;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stocktrader.common.events.OrderPlacedEvent;
import com.stocktrader.common.model.AssetType;
import com.stocktrader.common.model.OrderSide;
import com.stocktrader.common.model.OrderType;
import com.stocktrader.tradingquery.domain.OrderSummaryView;
import com.stocktrader.tradingquery.projection.EventProjectionEngine;
import com.stocktrader.tradingquery.repository.OrderSummaryViewRepository;
import com.stocktrader.tradingquery.repository.StoredEvent;
import com.stocktrader.tradingquery.repository.StoredEventRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class EventProjectionEngineTest {

    @Autowired
    private StoredEventRepository storedEventRepository;

    @Autowired
    private EventProjectionEngine projectionEngine;

    @Autowired
    private OrderSummaryViewRepository orderSummaryViewRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void projectsOrderPlacedEvent() throws Exception {
        OrderPlacedEvent event = new OrderPlacedEvent(
                UUID.randomUUID().toString(),
                "proj-order-1",
                Instant.now(),
                "11111111-1111-1111-1111-111111111111",
                "AAPL",
                AssetType.STOCK,
                OrderSide.BUY,
                OrderType.MARKET,
                BigDecimal.TEN,
                null
        );

        StoredEvent storedEvent = new StoredEvent(
                event.aggregateId(),
                event.eventId(),
                event.type(),
                objectMapper.writeValueAsString(event),
                event.occurredOn()
        );

        storedEventRepository.save(storedEvent);

        projectionEngine.project();

        OrderSummaryView view = orderSummaryViewRepository.findById("proj-order-1").orElseThrow();
        Assertions.assertEquals("AAPL", view.getSymbol());
        Assertions.assertEquals(com.stocktrader.common.model.OrderStatus.PENDING, view.getStatus());
    }
}

