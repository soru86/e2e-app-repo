package com.stocktrader.identity.api;

import com.stocktrader.identity.service.UserAccountService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserAccountService userAccountService;
    private final Map<String, UUID> activeTokens = new ConcurrentHashMap<>();

    public UserController(UserAccountService userAccountService) {
        this.userAccountService = userAccountService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterUserRequest request) {
        var profile = userAccountService.register(request.email(), request.displayName(), request.password());
        var token = UUID.randomUUID().toString();
        activeTokens.put(token, UUID.fromString(profile.userId()));
        return ResponseEntity.ok(new AuthResponse(profile.userId(), profile.email(), profile.displayName(), token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        var profile = userAccountService.authenticate(request.email(), request.password());
        var token = UUID.randomUUID().toString();
        activeTokens.put(token, UUID.fromString(profile.userId()));
        return ResponseEntity.ok(new AuthResponse(profile.userId(), profile.email(), profile.displayName(), token));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestHeader("X-Auth-Token") String token) {
        var userId = activeTokens.get(token);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid token"));
        }
        var profile = userAccountService.findById(userId);
        return ResponseEntity.ok(profile);
    }
}

