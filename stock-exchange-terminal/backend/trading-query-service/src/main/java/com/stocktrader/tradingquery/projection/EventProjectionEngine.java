package com.stocktrader.tradingquery.projection;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stocktrader.common.events.DomainEvent;
import com.stocktrader.common.events.OrderCancelledEvent;
import com.stocktrader.common.events.OrderFilledEvent;
import com.stocktrader.common.events.OrderPlacedEvent;
import com.stocktrader.common.events.PortfolioAdjustedEvent;
import com.stocktrader.common.util.EventEnvelope;
import com.stocktrader.common.util.EventMapper;
import com.stocktrader.tradingquery.domain.MarketTickerView;
import com.stocktrader.tradingquery.domain.OrderSummaryView;
import com.stocktrader.tradingquery.domain.PortfolioPositionView;
import com.stocktrader.tradingquery.repository.MarketTickerViewRepository;
import com.stocktrader.tradingquery.repository.OrderSummaryViewRepository;
import com.stocktrader.tradingquery.repository.PortfolioPositionViewRepository;
import com.stocktrader.tradingquery.repository.StoredEvent;
import com.stocktrader.tradingquery.repository.StoredEventRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Component
public class EventProjectionEngine {

    private static final Logger log = LoggerFactory.getLogger(EventProjectionEngine.class);
    private static final String PROJECTION_NAME = "order-projection";

    private final StoredEventRepository eventRepository;
    private final ProjectionOffsetRepository offsetRepository;
    private final OrderSummaryViewRepository orderSummaryViewRepository;
    private final PortfolioPositionViewRepository portfolioPositionViewRepository;
    private final MarketTickerViewRepository marketTickerViewRepository;
    private final EventMapper eventMapper;

    private long lastSequenceCached = 0L;

    public EventProjectionEngine(StoredEventRepository eventRepository,
                                 ProjectionOffsetRepository offsetRepository,
                                 OrderSummaryViewRepository orderSummaryViewRepository,
                                 PortfolioPositionViewRepository portfolioPositionViewRepository,
                                 MarketTickerViewRepository marketTickerViewRepository,
                                 ObjectMapper objectMapper) {
        this.eventRepository = eventRepository;
        this.offsetRepository = offsetRepository;
        this.orderSummaryViewRepository = orderSummaryViewRepository;
        this.portfolioPositionViewRepository = portfolioPositionViewRepository;
        this.marketTickerViewRepository = marketTickerViewRepository;
        this.eventMapper = new EventMapper(objectMapper);
    }

    @PostConstruct
    public void init() {
        lastSequenceCached = offsetRepository.findById(PROJECTION_NAME)
                .map(ProjectionOffset::getLastSequence)
                .orElse(0L);
    }

    @Scheduled(fixedDelay = 1000)
    @Transactional
    public void project() {
        List<StoredEvent> events = eventRepository.findAfter(lastSequenceCached);
        if (events.isEmpty()) {
            return;
        }
        log.debug("Projecting {} events from sequence {}", events.size(), lastSequenceCached);
        for (StoredEvent storedEvent : events) {
            DomainEvent event = eventMapper.toEvent(toEnvelope(storedEvent));
            apply(event);
            lastSequenceCached = storedEvent.getSequenceNumber();
        }
        offsetRepository.save(new ProjectionOffset(PROJECTION_NAME, lastSequenceCached));
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

    private void apply(DomainEvent event) {
        if (event instanceof OrderPlacedEvent placed) {
            applyOrderPlaced(placed);
        } else if (event instanceof OrderCancelledEvent cancelled) {
            applyOrderCancelled(cancelled);
        } else if (event instanceof OrderFilledEvent filled) {
            applyOrderFilled(filled);
        } else if (event instanceof PortfolioAdjustedEvent adjusted) {
            applyPortfolioAdjusted(adjusted);
        } else {
            log.debug("Ignoring event type {}", event.type());
        }
    }

    private void applyOrderPlaced(OrderPlacedEvent event) {
        OrderSummaryView view = new OrderSummaryView(
                event.aggregateId(),
                event.userId(),
                event.assetType(),
                event.symbol(),
                event.side(),
                event.orderType(),
                event.quantity(),
                event.limitPrice(),
                com.stocktrader.common.model.OrderStatus.PENDING,
                event.occurredOn(),
                event.occurredOn()
        );
        orderSummaryViewRepository.save(view);
    }

    private void applyOrderCancelled(OrderCancelledEvent event) {
        orderSummaryViewRepository.findById(event.aggregateId()).ifPresent(view -> {
            view.setStatus(com.stocktrader.common.model.OrderStatus.CANCELLED);
            view.setUpdatedAt(event.occurredOn());
            orderSummaryViewRepository.save(view);
        });
    }

    private void applyOrderFilled(OrderFilledEvent event) {
        orderSummaryViewRepository.findById(event.aggregateId()).ifPresent(view -> {
            view.setStatus(event.isFullyFilled()
                    ? com.stocktrader.common.model.OrderStatus.FILLED
                    : com.stocktrader.common.model.OrderStatus.PARTIALLY_FILLED);
            view.setUpdatedAt(event.occurredOn());
            orderSummaryViewRepository.save(view);
        });
    }

    private void applyPortfolioAdjusted(PortfolioAdjustedEvent event) {
        var position = portfolioPositionViewRepository.findByUserIdAndSymbol(event.getUserId(), event.getSymbol())
                .orElseGet(() -> new PortfolioPositionView(
                        event.getUserId(),
                        event.getSymbol(),
                        event.getAssetType(),
                        BigDecimal.ZERO,
                        BigDecimal.ZERO
                ));
        BigDecimal newQuantity = position.getQuantity().add(event.getDeltaQuantity());
        if (newQuantity.compareTo(BigDecimal.ZERO) < 0) {
            newQuantity = BigDecimal.ZERO;
        }
        position.setQuantity(newQuantity);
        if (newQuantity.compareTo(BigDecimal.ZERO) > 0) {
            position.setAveragePrice(event.getPrice());
        }
        portfolioPositionViewRepository.save(position);

        marketTickerViewRepository.findById(event.getSymbol()).ifPresentOrElse(ticker -> {
            ticker.setLastPrice(event.getPrice());
            ticker.setUpdatedAt(event.occurredOn());
            ticker.setChangeAbsolute(event.getPrice().multiply(BigDecimal.valueOf(0.01)));
            ticker.setChangePercent(BigDecimal.valueOf(1.0));
            marketTickerViewRepository.save(ticker);
        }, () -> {
            MarketTickerView ticker = new MarketTickerView(
                    event.getSymbol(),
                    event.getAssetType(),
                    event.getPrice(),
                    event.getPrice().multiply(BigDecimal.valueOf(0.01)),
                    BigDecimal.valueOf(1.0),
                    Instant.now()
            );
            marketTickerViewRepository.save(ticker);
        });
    }
}

