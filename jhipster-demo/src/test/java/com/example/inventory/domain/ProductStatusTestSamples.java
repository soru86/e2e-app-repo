package com.example.inventory.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class ProductStatusTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ProductStatus getProductStatusSample1() {
        return new ProductStatus()
            .id(1L)
            .code("AVAILABLE")
            .label("Available")
            .description("Sellable inventory")
            .isDefault(true)
            .isActive(true);
    }

    public static ProductStatus getProductStatusSample2() {
        return new ProductStatus()
            .id(2L)
            .code("OUT_OF_STOCK")
            .label("Out of stock")
            .description("Temporarily unavailable")
            .isDefault(false)
            .isActive(true);
    }

    public static ProductStatus getProductStatusRandomSampleGenerator() {
        long nextId = longCount.incrementAndGet();
        return new ProductStatus()
            .id(nextId)
            .code("STATUS_" + nextId)
            .label("Status " + nextId)
            .description("Generated status " + nextId)
            .isDefault(false)
            .isActive(true);
    }
}
