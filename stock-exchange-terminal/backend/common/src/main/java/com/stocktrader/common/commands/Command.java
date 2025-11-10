package com.stocktrader.common.commands;

import java.time.Instant;

public interface Command {
    String aggregateId();

    Instant timestamp();
}
