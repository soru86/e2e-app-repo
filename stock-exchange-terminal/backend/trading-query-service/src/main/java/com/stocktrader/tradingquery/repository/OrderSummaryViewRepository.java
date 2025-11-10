package com.stocktrader.tradingquery.repository;

import com.stocktrader.tradingquery.domain.OrderSummaryView;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderSummaryViewRepository extends JpaRepository<OrderSummaryView, String> {

    List<OrderSummaryView> findByUserIdOrderByCreatedAtDesc(String userId);

    List<OrderSummaryView> findBySymbolOrderByCreatedAtDesc(String symbol);
}

