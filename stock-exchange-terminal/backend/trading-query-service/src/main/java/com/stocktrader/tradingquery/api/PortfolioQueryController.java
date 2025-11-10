package com.stocktrader.tradingquery.api;

import com.stocktrader.tradingquery.domain.PortfolioPositionView;
import com.stocktrader.tradingquery.repository.PortfolioPositionViewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/query/portfolio")
@CrossOrigin(origins = "*")
public class PortfolioQueryController {

    private final PortfolioPositionViewRepository repository;

    public PortfolioQueryController(PortfolioPositionViewRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<PortfolioPositionView>> byUser(@PathVariable String userId) {
        return ResponseEntity.ok(repository.findByUserId(userId));
    }
}

