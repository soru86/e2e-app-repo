package com.stocktrader.tradingquery.api;

import com.stocktrader.tradingquery.domain.OrderSummaryView;
import com.stocktrader.tradingquery.repository.OrderSummaryViewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/query/orders")
@CrossOrigin(origins = "*")
public class OrderQueryController {

    private final OrderSummaryViewRepository repository;

    public OrderQueryController(OrderSummaryViewRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<OrderSummaryView>> list(@RequestParam(required = false) String userId,
                                                       @RequestParam(required = false) String symbol) {
        if (userId != null && !userId.isBlank()) {
            return ResponseEntity.ok(repository.findByUserIdOrderByCreatedAtDesc(userId));
        }
        if (symbol != null && !symbol.isBlank()) {
            return ResponseEntity.ok(repository.findBySymbolOrderByCreatedAtDesc(symbol));
        }
        return ResponseEntity.ok(repository.findAll());
    }
}

