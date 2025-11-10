package com.stocktrader.tradingcommand.store;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StoredEventRepository extends JpaRepository<StoredEvent, Long> {

    List<StoredEvent> findByAggregateIdOrderBySequenceNumber(String aggregateId);

    @Query("select e from StoredEvent e where e.sequenceNumber > :after order by e.sequenceNumber")
    List<StoredEvent> findAfter(long after);
}

