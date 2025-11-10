package com.stocktrader.tradingcommand.api;

import com.stocktrader.common.commands.CancelOrderCommand;
import com.stocktrader.common.commands.PlaceOrderCommand;
import com.stocktrader.common.util.EventEnvelope;
import com.stocktrader.tradingcommand.service.OrderCommandService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/commands/orders")
@CrossOrigin(origins = "*")
public class OrderCommandController {

    private final OrderCommandService orderCommandService;

    public OrderCommandController(OrderCommandService orderCommandService) {
        this.orderCommandService = orderCommandService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> placeOrder(@RequestBody @Valid PlaceOrderRequest request) {
        PlaceOrderCommand command = PlaceOrderCommand.create(
                request.userId(),
                request.symbol(),
                request.assetType(),
                request.side(),
                request.orderType(),
                request.quantity(),
                request.limitPrice()
        );

        List<EventEnvelope> events = orderCommandService.handle(command);
        return ResponseEntity.ok(Map.of(
                "orderId", command.aggregateId(),
                "events", events
        ));
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelOrder(@PathVariable String orderId) {
        CancelOrderCommand command = new CancelOrderCommand(orderId, orderId, commandTimestamp());
        List<EventEnvelope> events = orderCommandService.handle(command);
        return ResponseEntity.ok(Map.of(
                "orderId", orderId,
                "events", events
        ));
    }

    private java.time.Instant commandTimestamp() {
        return java.time.Instant.now();
    }
}

