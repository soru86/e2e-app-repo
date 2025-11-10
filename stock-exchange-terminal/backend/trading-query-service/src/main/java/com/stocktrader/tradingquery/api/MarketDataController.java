package com.stocktrader.tradingquery.api;

import com.stocktrader.tradingquery.domain.MarketTickerView;
import com.stocktrader.tradingquery.repository.MarketTickerViewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/query/market-data")
@CrossOrigin(origins = "*")
public class MarketDataController {

    private final MarketTickerViewRepository repository;

    public MarketDataController(MarketTickerViewRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<MarketTickerView>> list() {
        return ResponseEntity.ok(repository.findAll());
    }
}

