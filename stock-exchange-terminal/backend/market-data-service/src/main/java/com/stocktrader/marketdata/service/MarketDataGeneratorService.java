package com.stocktrader.marketdata.service;

import com.stocktrader.common.model.AssetType;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class MarketDataGeneratorService {

    private final Map<String, TickerSnapshot> baseSnapshots = Map.of(
            "AAPL", new TickerSnapshot("AAPL", AssetType.STOCK, BigDecimal.valueOf(192.34), BigDecimal.ZERO, BigDecimal.ZERO, Instant.now()),
            "TSLA", new TickerSnapshot("TSLA", AssetType.STOCK, BigDecimal.valueOf(248.77), BigDecimal.ZERO, BigDecimal.ZERO, Instant.now()),
            "ETH", new TickerSnapshot("ETH", AssetType.CRYPTO, BigDecimal.valueOf(3412.55), BigDecimal.ZERO, BigDecimal.ZERO, Instant.now()),
            "BTC", new TickerSnapshot("BTC", AssetType.CRYPTO, BigDecimal.valueOf(47895.12), BigDecimal.ZERO, BigDecimal.ZERO, Instant.now()),
            "US10Y", new TickerSnapshot("US10Y", AssetType.BOND, BigDecimal.valueOf(99.45), BigDecimal.ZERO, BigDecimal.ZERO, Instant.now()),
            "GLD", new TickerSnapshot("GLD", AssetType.ETF, BigDecimal.valueOf(177.80), BigDecimal.ZERO, BigDecimal.ZERO, Instant.now())
    );

    private final Sinks.Many<TickerSnapshot> sink = Sinks.many().multicast().onBackpressureBuffer();

    @PostConstruct
    public void startEmitting() {
        Flux.interval(Duration.ofSeconds(2))
                .map(this::randomSnapshot)
                .subscribe(sink::tryEmitNext);
    }

    public Flux<TickerSnapshot> stream() {
        return sink.asFlux();
    }

    public Map<String, TickerSnapshot> currentSnapshot() {
        return baseSnapshots.entrySet().stream()
                .collect(java.util.stream.Collectors.toMap(Map.Entry::getKey, entry -> randomize(entry.getValue())));
    }

    private TickerSnapshot randomSnapshot(long tick) {
        return randomize(baseSnapshots.values().stream()
                .skip(ThreadLocalRandom.current().nextInt(baseSnapshots.size()))
                .findFirst()
                .orElseThrow());
    }

    private TickerSnapshot randomize(TickerSnapshot snapshot) {
        double variance = ThreadLocalRandom.current().nextDouble(-2.0, 2.0);
        BigDecimal newPrice = snapshot.price().add(BigDecimal.valueOf(variance)).max(BigDecimal.valueOf(0.01));
        BigDecimal changeAbs = BigDecimal.valueOf(variance).setScale(2, RoundingMode.HALF_UP);
        BigDecimal changePercent = newPrice.subtract(snapshot.price())
                .divide(snapshot.price(), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
        return new TickerSnapshot(
                snapshot.symbol(),
                snapshot.assetType(),
                newPrice.setScale(2, RoundingMode.HALF_UP),
                changeAbs,
                changePercent,
                Instant.now()
        );
    }
}

