# Keycloak Setup - Screenshot Guide

This document indicates where screenshots would be helpful when following the Keycloak setup guide. Use this as a reference when creating visual documentation.

## Recommended Screenshots

### 1. Initial Access
**Location**: Step 1 - Access Keycloak Admin Console
- Screenshot of Keycloak welcome page at `http://localhost:8080`
- Highlight the "Administration Console" link

### 2. Login Page
**Location**: Step 1 - Login
- Screenshot of Keycloak admin login page
- Show username/password fields

### 3. Realm Dropdown
**Location**: Step 2 - Create Realm
- Screenshot of Keycloak admin console with realm dropdown visible
- Show "master" realm selected with "Create realm" option

### 4. Create Realm Form
**Location**: Step 2 - Create Realm
- Screenshot of "Create realm" form
- Show realm name field with "super-shop" entered

### 5. Clients List
**Location**: Step 3 - Create Client
- Screenshot of Clients page showing empty list or existing clients
- Highlight "Create client" button

### 6. Client Type Selection
**Location**: Step 3 - Client Type
- Screenshot of client creation wizard
- Show "OpenID Connect" selected

### 7. Client Capabilities
**Location**: Step 3 - Capability Config
- Screenshot of capability configuration
- Show:
  - Client authentication: OFF
  - Standard flow: ON
  - Direct access grants: ON

### 8. Client Login Settings
**Location**: Step 3 - Login Settings
- Screenshot of login settings form
- Show all fields filled:
  - Client ID: `super-shop-console`
  - Valid redirect URIs with all three URLs
  - Web origins with all three URLs

### 9. Realm Roles List
**Location**: Step 4 - Create Roles
- Screenshot of Realm roles page
- Show "Create role" button

### 10. Create Role Form
**Location**: Step 4 - Create Roles
- Screenshot of "Create role" form
- Show role name field (for both CUSTOMER and ADMIN)

### 11. Users List
**Location**: Step 5 - Create Users
- Screenshot of Users page
- Show "Create new user" button

### 12. Create User Form
**Location**: Step 5 - Create Users
- Screenshot of user creation form
- Show:
  - Username field
  - Email field
  - Email verified toggle
  - First/Last name fields

### 13. User Credentials Tab
**Location**: Step 5 - Set Password
- Screenshot of user's Credentials tab
- Show "Set password" button

### 14. Set Password Form
**Location**: Step 5 - Set Password
- Screenshot of password form
- Show:
  - Password field
  - Temporary toggle (OFF)

### 15. Role Mapping Tab
**Location**: Step 5 - Assign Roles
- Screenshot of user's Role mapping tab
- Show "Assign role" button

### 16. Assign Role Dialog
**Location**: Step 5 - Assign Roles
- Screenshot of role assignment dialog
- Show:
  - Filter by realm roles selected
  - CUSTOMER or ADMIN checkbox selected

### 17. Client Scopes - Roles
**Location**: Step 6 - Client Scopes
- Screenshot of "roles" client scope page
- Show Mappers tab

### 18. Roles Mapper Configuration
**Location**: Step 6 - Roles Mapper
- Screenshot of realm roles mapper
- Show:
  - Token Claim Name: `realm_access.roles`
  - Add to access token: ON
  - Add to ID token: ON

### 19. Login Flow Test
**Location**: Step 7 - Verify Configuration
- Screenshot of Keycloak login page when accessing `http://localhost:4173`
- Show redirect working

### 20. Token Decoded
**Location**: Step 7 - Verify Token
- Screenshot of decoded JWT token at jwt.io
- Highlight `realm_access.roles` array showing `["CUSTOMER"]` or `["ADMIN"]`

## Screenshot Tips

1. **Use browser DevTools**: Press F12 to show relevant UI elements
2. **Highlight important fields**: Use arrows, circles, or annotations
3. **Show full context**: Include navigation sidebar when possible
4. **Consistent styling**: Use same browser/theme for all screenshots
5. **Add annotations**: Use text labels to explain what's being shown

## Tools for Creating Screenshots

- **macOS**: Cmd + Shift + 4 (select area), Cmd + Shift + 3 (full screen)
- **Windows**: Snipping Tool or Win + Shift + S
- **Linux**: Screenshot tool or `gnome-screenshot`
- **Browser Extensions**: 
  - Awesome Screenshot
  - Nimbus Screenshot
  - Lightshot

## Adding Screenshots to Documentation

1. Save screenshots in `docs/images/keycloak/` directory
2. Name files descriptively: `01-keycloak-welcome-page.png`
3. Reference in `KEYCLOAK.md` using:
   ```markdown
   ![Keycloak Welcome Page](./images/keycloak/01-keycloak-welcome-page.png)
   ```

## Alternative: Video Tutorial

Consider creating a screen recording showing the complete setup process:
- Use tools like OBS, QuickTime (macOS), or Windows Game Bar
- Keep it under 10 minutes
- Add narration or captions
- Upload to YouTube or include as MP4 in docs






