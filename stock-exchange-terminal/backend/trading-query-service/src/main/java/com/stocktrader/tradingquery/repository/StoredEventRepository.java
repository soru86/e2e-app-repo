package com.stocktrader.tradingquery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StoredEventRepository extends JpaRepository<StoredEvent, Long> {

    @Query("select e from StoredEvent e where e.sequenceNumber > :after order by e.sequenceNumber")
    List<StoredEvent> findAfter(long after);
}

