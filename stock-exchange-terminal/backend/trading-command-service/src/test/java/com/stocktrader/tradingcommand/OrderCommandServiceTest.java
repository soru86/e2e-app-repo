package com.stocktrader.tradingcommand;

import com.stocktrader.common.commands.PlaceOrderCommand;
import com.stocktrader.common.model.AssetType;
import com.stocktrader.common.model.OrderSide;
import com.stocktrader.common.model.OrderType;
import com.stocktrader.tradingcommand.service.OrderCommandService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

import java.math.BigDecimal;
import java.time.Instant;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class OrderCommandServiceTest {

    @Autowired
    private OrderCommandService orderCommandService;

    @Test
    void placeOrderProducesEvent() {
        PlaceOrderCommand command = new PlaceOrderCommand(
                "test-order-1",
                "11111111-1111-1111-1111-111111111111",
                "AAPL",
                AssetType.STOCK,
                OrderSide.BUY,
                OrderType.MARKET,
                BigDecimal.TEN,
                null,
                Instant.now()
        );

        var events = orderCommandService.handle(command);
        Assertions.assertEquals(1, events.size());
        Assertions.assertEquals("OrderPlaced", events.get(0).type());
    }
}

