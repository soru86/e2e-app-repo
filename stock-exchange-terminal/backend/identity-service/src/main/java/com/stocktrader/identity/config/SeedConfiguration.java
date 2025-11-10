package com.stocktrader.identity.config;

import com.stocktrader.identity.domain.UserAccount;
import com.stocktrader.identity.domain.UserAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.UUID;

@Configuration
public class SeedConfiguration {

    private static final Logger log = LoggerFactory.getLogger(SeedConfiguration.class);

    private static final Map<String, UUID> PRESET_USER_IDS = Map.of(
            "alice@example.com", UUID.fromString("11111111-1111-1111-1111-111111111111"),
            "bob@example.com", UUID.fromString("22222222-2222-2222-2222-222222222222"),
            "charlie@example.com", UUID.fromString("33333333-3333-3333-3333-333333333333"),
            "diana@example.com", UUID.fromString("44444444-4444-4444-4444-444444444444"),
            "eva@example.com", UUID.fromString("55555555-5555-5555-5555-555555555555"),
            "frank@example.com", UUID.fromString("66666666-6666-6666-6666-666666666666")
    );

    @Bean
    CommandLineRunner seedUsers(UserAccountRepository repository, PasswordEncoder passwordEncoder) {
        return args -> PRESET_USER_IDS.forEach((email, id) -> {
            repository.findByEmail(email).ifPresentOrElse(
                    user -> log.debug("User {} already present", email),
                    () -> {
                        String displayName = email.substring(0, email.indexOf('@'));
                        UserAccount account = UserAccount.createWithId(
                                id,
                                email,
                                capitalize(displayName),
                                passwordEncoder.encode("password123"),
                                "USER"
                        );
                        repository.save(account);
                        log.info("Seeded user {} with id {}", email, id);
                    }
            );
        });
    }

    private String capitalize(String name) {
        if (name.isEmpty()) {
            return name;
        }
        return Character.toUpperCase(name.charAt(0)) + name.substring(1);
    }
}

