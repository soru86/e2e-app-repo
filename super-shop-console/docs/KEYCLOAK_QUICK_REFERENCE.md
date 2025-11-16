# Keycloak Quick Reference Checklist

Use this checklist to quickly verify your Keycloak configuration.

## ✅ Configuration Checklist

### Realm Setup
- [ ] Realm `super-shop` created
- [ ] Realm is active and selected

### Client Configuration
- [ ] Client `super-shop-console` created
- [ ] Client type: OpenID Connect
- [ ] Client authentication: **OFF** (Public)
- [ ] Standard flow: **ON**
- [ ] Direct access grants: **ON**
- [ ] Valid redirect URIs:
  - [ ] `http://localhost:4173/*`
  - [ ] `http://localhost:4174/*`
  - [ ] `http://localhost:4175/*`
- [ ] Web origins:
  - [ ] `http://localhost:4173`
  - [ ] `http://localhost:4174`
  - [ ] `http://localhost:4175`

### Roles
- [ ] Role `CUSTOMER` created
- [ ] Role `ADMIN` created

### Users
- [ ] `customer1@super-shop.com` created
  - [ ] Password set (not temporary)
  - [ ] Email verified: ON
  - [ ] CUSTOMER role assigned
- [ ] `customer2@super-shop.com` created
  - [ ] Password set (not temporary)
  - [ ] Email verified: ON
  - [ ] CUSTOMER role assigned
- [ ] `admin1@super-shop.com` created
  - [ ] Password set (not temporary)
  - [ ] Email verified: ON
  - [ ] ADMIN role assigned
- [ ] `admin2@super-shop.com` created
  - [ ] Password set (not temporary)
  - [ ] Email verified: ON
  - [ ] ADMIN role assigned

### Token Configuration
- [ ] Roles mapper enabled in `roles` client scope
- [ ] Roles added to access token: **ON**
- [ ] Roles added to ID token: **ON**

## 🔍 Quick Test

1. Navigate to `http://localhost:4173`
2. Should redirect to Keycloak login
3. Login with `customer1@super-shop.com`
4. Should redirect back to app
5. Check browser console for any errors

## 📋 Key Values Reference

| Setting | Value |
|---------|-------|
| Realm Name | `super-shop` |
| Client ID | `super-shop-console` |
| Client Type | Public (OpenID Connect) |
| Issuer URL | `http://localhost:8080/auth/realms/super-shop` |
| Callback URL | `http://localhost:4000/auth/callback` |
| Admin Console | `http://localhost:8080` |
| Admin Username | `admin` |
| Admin Password | `admin` |

## 🚨 Common Issues & Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| Invalid redirect URI | Add exact URL to "Valid redirect URIs" |
| Client not found | Check client ID is exactly `super-shop-console` |
| Access denied | Verify role is assigned in user's "Role mapping" tab |
| CORS error | Add frontend URL to "Web origins" |
| Token missing roles | Enable roles mapper in client scopes |

## 📚 Full Documentation

For detailed step-by-step instructions with screenshots, see [KEYCLOAK.md](./KEYCLOAK.md).




