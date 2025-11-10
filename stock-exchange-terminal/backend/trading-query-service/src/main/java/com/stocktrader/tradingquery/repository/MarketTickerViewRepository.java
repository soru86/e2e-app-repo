package com.stocktrader.tradingquery.repository;

import com.stocktrader.tradingquery.domain.MarketTickerView;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarketTickerViewRepository extends JpaRepository<MarketTickerView, String> {
}

