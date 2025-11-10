package com.stocktrader.marketdata.api;

import com.stocktrader.marketdata.service.MarketDataGeneratorService;
import com.stocktrader.marketdata.service.TickerSnapshot;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.util.Collection;

@RestController
@RequestMapping("/api/market-data")
@CrossOrigin(origins = "*")
public class MarketDataController {

    private final MarketDataGeneratorService marketDataGeneratorService;

    public MarketDataController(MarketDataGeneratorService marketDataGeneratorService) {
        this.marketDataGeneratorService = marketDataGeneratorService;
    }

    @GetMapping
    public ResponseEntity<Collection<TickerSnapshot>> list() {
        return ResponseEntity.ok(marketDataGeneratorService.currentSnapshot().values());
    }

    @GetMapping(path = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<TickerSnapshot> stream() {
        return marketDataGeneratorService.stream();
    }
}

