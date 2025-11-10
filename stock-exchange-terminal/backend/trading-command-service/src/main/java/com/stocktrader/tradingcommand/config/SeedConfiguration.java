package com.stocktrader.tradingcommand.config;

import com.stocktrader.common.commands.PlaceOrderCommand;
import com.stocktrader.common.events.OrderFilledEvent;
import com.stocktrader.common.events.PortfolioAdjustedEvent;
import com.stocktrader.common.model.AssetType;
import com.stocktrader.common.model.OrderSide;
import com.stocktrader.common.model.OrderType;
import com.stocktrader.common.util.EventStore;
import com.stocktrader.tradingcommand.service.OrderCommandService;
import com.stocktrader.tradingcommand.store.StoredEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Configuration
public class SeedConfiguration {

    private static final Logger log = LoggerFactory.getLogger(SeedConfiguration.class);

    @Bean
    CommandLineRunner seedOrders(StoredEventRepository repository,
                                OrderCommandService commandService,
                                EventStore eventStore) {
        return args -> {
            if (repository.count() > 0) {
                log.debug("Skipping order seeding, events already present");
                return;
            }
            List<PlaceOrderCommand> commands = List.of(
                    new PlaceOrderCommand("ord-apple-1", "11111111-1111-1111-1111-111111111111", "AAPL",
                            AssetType.STOCK, OrderSide.BUY, OrderType.MARKET, BigDecimal.valueOf(25), null, Instant.now()),
                    new PlaceOrderCommand("ord-apple-2", "11111111-1111-1111-1111-111111111111", "AAPL",
                            AssetType.STOCK, OrderSide.SELL, OrderType.LIMIT, BigDecimal.valueOf(10), BigDecimal.valueOf(194.5), Instant.now()),
                    new PlaceOrderCommand("ord-eth-1", "33333333-3333-3333-3333-333333333333", "ETH",
                            AssetType.CRYPTO, OrderSide.BUY, OrderType.MARKET, BigDecimal.valueOf(4), null, Instant.now()),
                    new PlaceOrderCommand("ord-tsla-1", "22222222-2222-2222-2222-222222222222", "TSLA",
                            AssetType.STOCK, OrderSide.BUY, OrderType.LIMIT, BigDecimal.valueOf(15), BigDecimal.valueOf(245.75), Instant.now()),
                    new PlaceOrderCommand("ord-gold-1", "44444444-4444-4444-4444-444444444444", "GLD",
                            AssetType.ETF, OrderSide.BUY, OrderType.MARKET, BigDecimal.valueOf(8), null, Instant.now()),
                    new PlaceOrderCommand("ord-bond-1", "55555555-5555-5555-5555-555555555555", "US10Y",
                            AssetType.BOND, OrderSide.SELL, OrderType.MARKET, BigDecimal.valueOf(5), null, Instant.now())
            );
            commands.forEach(command -> {
                try {
                    var envelopes = commandService.handle(command);
                    envelopes.stream()
                            .map(EventEnvelopeWrapper::new)
                            .forEach(wrapper -> log.debug("Seeded event {}", wrapper.eventType()));
                    log.info("Seeded order {}", command.aggregateId());
                } catch (Exception ex) {
                    log.warn("Failed to seed order {}: {}", command.aggregateId(), ex.getMessage());
                }
            });

            // Simulate fills and portfolio adjustments for richer projections
            eventStore.append(OrderFilledEvent.from("ord-apple-1", BigDecimal.valueOf(25), BigDecimal.valueOf(191.20), true));
            eventStore.append(PortfolioAdjustedEvent.from("portfolio-11111111-1111-1111-1111-111111111111",
                    "11111111-1111-1111-1111-111111111111", "AAPL", AssetType.STOCK, BigDecimal.valueOf(25), BigDecimal.valueOf(191.20)));

            eventStore.append(PortfolioAdjustedEvent.from("portfolio-22222222-2222-2222-2222-222222222222",
                    "22222222-2222-2222-2222-222222222222", "TSLA", AssetType.STOCK, BigDecimal.valueOf(15), BigDecimal.valueOf(245.75)));

            eventStore.append(PortfolioAdjustedEvent.from("portfolio-33333333-3333-3333-3333-333333333333",
                    "33333333-3333-3333-3333-333333333333", "ETH", AssetType.CRYPTO, BigDecimal.valueOf(4), BigDecimal.valueOf(3410.00)));

            eventStore.append(PortfolioAdjustedEvent.from("portfolio-44444444-4444-4444-4444-444444444444",
                    "44444444-4444-4444-4444-444444444444", "GLD", AssetType.ETF, BigDecimal.valueOf(8), BigDecimal.valueOf(177.20)));

            log.info("Seeded portfolio adjustments and fills");
        };
    }

    private record EventEnvelopeWrapper(com.stocktrader.common.util.EventEnvelope envelope) {
        String eventType() {
            return envelope.type();
        }
    }
}

