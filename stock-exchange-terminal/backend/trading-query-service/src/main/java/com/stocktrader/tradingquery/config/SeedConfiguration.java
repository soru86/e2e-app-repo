package com.stocktrader.tradingquery.config;

import com.stocktrader.common.model.AssetType;
import com.stocktrader.tradingquery.domain.MarketTickerView;
import com.stocktrader.tradingquery.repository.MarketTickerViewRepository;
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
    CommandLineRunner seedMarketTickers(MarketTickerViewRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                log.debug("Market tickers already seeded");
                return;
            }
            List<MarketTickerView> tickers = List.of(
                    new MarketTickerView("AAPL", AssetType.STOCK, BigDecimal.valueOf(192.34), BigDecimal.valueOf(1.12), BigDecimal.valueOf(0.58), Instant.now()),
                    new MarketTickerView("TSLA", AssetType.STOCK, BigDecimal.valueOf(248.77), BigDecimal.valueOf(-3.45), BigDecimal.valueOf(-1.37), Instant.now()),
                    new MarketTickerView("ETH", AssetType.CRYPTO, BigDecimal.valueOf(3412.55), BigDecimal.valueOf(44.91), BigDecimal.valueOf(1.34), Instant.now()),
                    new MarketTickerView("BTC", AssetType.CRYPTO, BigDecimal.valueOf(47895.12), BigDecimal.valueOf(512.12), BigDecimal.valueOf(1.08), Instant.now()),
                    new MarketTickerView("US10Y", AssetType.BOND, BigDecimal.valueOf(99.45), BigDecimal.valueOf(0.22), BigDecimal.valueOf(0.22), Instant.now()),
                    new MarketTickerView("GLD", AssetType.ETF, BigDecimal.valueOf(177.80), BigDecimal.valueOf(0.80), BigDecimal.valueOf(0.45), Instant.now())
            );
            repository.saveAll(tickers);
            log.info("Seeded {} market tickers", tickers.size());
        };
    }
}

