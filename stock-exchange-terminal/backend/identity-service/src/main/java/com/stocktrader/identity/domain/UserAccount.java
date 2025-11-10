package com.stocktrader.identity.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_accounts")
public class UserAccount {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String displayName;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String roles;

    @Column(nullable = false)
    private Instant createdAt;

    protected UserAccount() {
    }

    private UserAccount(UUID id, String email, String displayName, String passwordHash, String roles, Instant createdAt) {
        this.id = id;
        this.email = email;
        this.displayName = displayName;
        this.passwordHash = passwordHash;
        this.roles = roles;
        this.createdAt = createdAt;
    }

    public static UserAccount create(String email, String displayName, String passwordHash, String roles) {
        return createWithId(UUID.randomUUID(), email, displayName, passwordHash, roles);
    }

    public static UserAccount createWithId(UUID id, String email, String displayName, String passwordHash, String roles) {
        return new UserAccount(id, email, displayName, passwordHash, roles, Instant.now());
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getRoles() {
        return roles;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}

