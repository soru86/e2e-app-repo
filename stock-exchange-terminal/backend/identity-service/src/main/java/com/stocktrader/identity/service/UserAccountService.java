package com.stocktrader.identity.service;

import com.stocktrader.common.model.UserProfile;
import com.stocktrader.identity.domain.UserAccount;
import com.stocktrader.identity.domain.UserAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserAccountService {

    private final UserAccountRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserAccountService(UserAccountRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserProfile register(String email, String displayName, String rawPassword) {
        repository.findByEmail(email).ifPresent(existing -> {
            throw new IllegalStateException("Email already registered");
        });
        UserAccount account = UserAccount.create(email, displayName, passwordEncoder.encode(rawPassword), "USER");
        UserAccount saved = repository.save(account);
        return new UserProfile(saved.getId().toString(), saved.getEmail(), saved.getDisplayName(), saved.getCreatedAt());
    }

    public UserProfile authenticate(String email, String rawPassword) {
        UserAccount account = repository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!passwordEncoder.matches(rawPassword, account.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        return new UserProfile(account.getId().toString(), account.getEmail(), account.getDisplayName(), account.getCreatedAt());
    }

    public UserProfile findById(UUID userId) {
        UserAccount account = repository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return new UserProfile(account.getId().toString(), account.getEmail(), account.getDisplayName(), account.getCreatedAt());
    }
}

