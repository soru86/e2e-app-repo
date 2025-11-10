package com.stocktrader.tradingquery.repository;

import com.stocktrader.tradingquery.domain.PortfolioPositionView;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PortfolioPositionViewRepository extends JpaRepository<PortfolioPositionView, Long> {

    List<PortfolioPositionView> findByUserId(String userId);

    Optional<PortfolioPositionView> findByUserIdAndSymbol(String userId, String symbol);
}

