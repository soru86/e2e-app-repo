# Keycloak Setup Guide for Super Shop Console

This guide provides detailed step-by-step instructions for configuring Keycloak Identity Provider for the Super Shop Console application.

## Prerequisites

1. Keycloak running via Docker Compose (or standalone installation)
2. Access to Keycloak Admin Console at `http://localhost:8080`
3. Admin credentials: `admin` / `admin` (default from docker-compose)

## Step-by-Step Configuration

### Step 1: Access Keycloak Admin Console

1. Start Keycloak (if not already running):
   ```bash
   docker-compose up keycloak -d
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

3. Click on **"Administration Console"** link at the bottom of the page

4. Login with admin credentials:
   - **Username**: `admin`
   - **Password**: `admin`

### Step 2: Create a New Realm

1. In the top-left corner, you'll see a dropdown showing **"master"** realm
2. Click on the realm dropdown and select **"Create realm"**
3. Enter the realm name: **`super-shop`**
4. Click **"Create"**
5. You should now see the realm **"super-shop"** selected in the dropdown

### Step 3: Create Client Application

1. In the left sidebar, navigate to **"Clients"** (under "Configure")
2. Click **"Create client"** button
3. **General Settings**:
   - **Client type**: Select **"OpenID Connect"**
   - **Client ID**: `super-shop-console`
   - **Client Name**: `Super Shop Console`
   - Click **"Next"**

4. **Capability config**:
   - **Client authentication**: Toggle **OFF** (Public client for frontend)
   - **Authorization**: Toggle **OFF**
   - **Standard flow**: Toggle **ON** ✅
   - **Direct access grants**: Toggle **ON** ✅ (for testing)
   - Click **"Next"**

5. **Login settings**:
   - **Client ID**: `super-shop-console`
   - **Root URL**: Leave empty
   - **Home URL**: `http://localhost:4173`
   - **Valid redirect URIs**: 
     ```
     http://localhost:4173/*
     http://localhost:4174/*
     http://localhost:4175/*
     ```
   - **Valid post logout redirect URIs**: 
     ```
     http://localhost:4173/*
     http://localhost:4174/*
     http://localhost:4175/*
     ```
   - **Web origins**: 
     ```
     http://localhost:4173
     http://localhost:4174
     http://localhost:4175
     ```
   - Click **"Save"**

6. **Client Settings** (after saving):
   - Scroll down to **"Advanced settings"**
   - **Access token lifespan**: `5 Minutes` (default is fine)
   - **Client session idle timeout**: `30 Minutes` (default is fine)
   - Click **"Save"** if you made changes

7. **Note on Client Secret**:
   - Since this is a **public client** (Client authentication: OFF), Keycloak does **not** generate or require a client secret
   - However, the backend Passport library still expects a `KEYCLOAK_CLIENT_SECRET` value in the environment
   - For public clients, you can use any placeholder value (e.g., `local-secret`) - it will not be validated by Keycloak
   - The default value `local-secret` in your `.env` file is sufficient for development
   - **Important**: Do not try to copy a "Client secret" from Keycloak UI for this public client - it doesn't exist and isn't needed

### Step 4: Create Realm Roles

1. In the left sidebar, navigate to **"Realm roles"** (under "Configure")
2. Click **"Create role"** button
3. Create **CUSTOMER** role:
   - **Role name**: `CUSTOMER`
   - **Description**: `Customer role for regular users`
   - Click **"Create"**
4. Click **"Create role"** again
5. Create **ADMIN** role:
   - **Role name**: `ADMIN`
   - **Description**: `Administrator role for shop owners`
   - Click **"Create"**

### Step 5: Create Users

#### Create Customer Users

1. In the left sidebar, navigate to **"Users"** (under "Manage")
2. Click **"Create new user"** button
3. **Create user - customer1**:
   - **Username**: `customer1@super-shop.com`
   - **Email**: `customer1@super-shop.com`
   - **Email verified**: Toggle **ON** ✅
   - **First name**: `Customer`
   - **Last name**: `One`
   - Click **"Create"**

4. **Set password for customer1**:
   - Go to the **"Credentials"** tab
   - Click **"Set password"**
   - **Password**: Enter a secure password (e.g., `Customer123!`)
   - **Temporary**: Toggle **OFF** ✅ (so user doesn't need to change password on first login)
   - Click **"Save"**
   - Click **"Set password"** in the confirmation dialog

5. **Assign CUSTOMER role to customer1**:
   - Go to the **"Role mapping"** tab
   - Click **"Assign role"**
   - Filter by **"Filter by clients"** → Select **"Filter by realm roles"**
   - Select **"CUSTOMER"** checkbox
   - Click **"Assign"**

6. Repeat steps 2-5 for **customer2**:
   - **Username**: `customer2@super-shop.com`
   - **Email**: `customer2@super-shop.com`
   - Assign **CUSTOMER** role

#### Create Admin Users

1. Click **"Create new user"** button
2. **Create user - admin1**:
   - **Username**: `admin1@super-shop.com`
   - **Email**: `admin1@super-shop.com`
   - **Email verified**: Toggle **ON** ✅
   - **First name**: `Admin`
   - **Last name**: `One`
   - Click **"Create"**

3. **Set password for admin1**:
   - Go to the **"Credentials"** tab
   - Click **"Set password"**
   - **Password**: Enter a secure password (e.g., `Admin123!`)
   - **Temporary**: Toggle **OFF** ✅
   - Click **"Save"**
   - Click **"Set password"** in the confirmation dialog

4. **Assign ADMIN role to admin1**:
   - Go to the **"Role mapping"** tab
   - Click **"Assign role"**
   - Filter by **"Filter by realm roles"**
   - Select **"ADMIN"** checkbox
   - Click **"Assign"**

5. Repeat steps 1-4 for **admin2**:
   - **Username**: `admin2@super-shop.com`
   - **Email**: `admin2@super-shop.com`
   - Assign **ADMIN** role

### Step 6: Configure Client Scopes (Optional but Recommended)

1. In the left sidebar, navigate to **"Client scopes"** (under "Configure")
2. Click on **"roles"** scope
3. Go to the **"Mappers"** tab
4. Verify that **"realm roles"** mapper exists with:
   - **Name**: `realm roles`
   - **Token Claim Name**: `realm_access.roles`
   - **Add to access token**: **ON** ✅
   - **Add to ID token**: **ON** ✅

### Step 7: Verify Configuration

1. **Test Login Flow**:
   - Navigate to: `http://localhost:4173`
   - You should be redirected to Keycloak login page
   - Try logging in with:
     - `customer1@super-shop.com` / `Customer123!` (or your password)
     - `admin1@super-shop.com` / `Admin123!` (or your password)

2. **Verify Token Contains Roles**:
   - After login, check browser DevTools → Application → Local Storage
   - Look for Keycloak tokens
   - Decode the access token at [jwt.io](https://jwt.io)
   - Verify `realm_access.roles` contains `["CUSTOMER"]` or `["ADMIN"]`

## Configuration Summary

After completing all steps, you should have:

- ✅ **Realm**: `super-shop`
- ✅ **Client**: `super-shop-console` (Public client)
- ✅ **Roles**: `CUSTOMER`, `ADMIN`
- ✅ **Users**:
  - `customer1@super-shop.com` (CUSTOMER role)
  - `customer2@super-shop.com` (CUSTOMER role)
  - `admin1@super-shop.com` (ADMIN role)
  - `admin2@super-shop.com` (ADMIN role)

## Environment Variables

Ensure your application has these environment variables set:

**Backend Gateway** (`apps/backend-gateway/.env` or environment):
```env
KEYCLOAK_ISSUER_URL=http://localhost:8080/auth/realms/super-shop
KEYCLOAK_CLIENT_ID=super-shop-console
KEYCLOAK_CLIENT_SECRET=local-secret
KEYCLOAK_CALLBACK_URL=http://localhost:4000/auth/callback
```

**Important Note on `KEYCLOAK_CLIENT_SECRET`**:
- Since `super-shop-console` is a **public client** (no client authentication), Keycloak does not generate a client secret
- The `KEYCLOAK_CLIENT_SECRET` value (`local-secret`) is a placeholder that satisfies the Passport library requirement
- This value is **not validated** by Keycloak for public clients - you can use any string value
- For production, consider creating a separate **confidential client** for backend-to-backend communication if needed

**Frontend Shell** (via Vite env vars):
```env
VITE_KEYCLOAK_URL=http://localhost:8080/auth
VITE_KEYCLOAK_REALM=super-shop
VITE_KEYCLOAK_CLIENT_ID=super-shop-console
```

## Troubleshooting

### Issue: "Invalid redirect URI"
- **Solution**: Ensure all redirect URIs in Step 3 include the exact URLs your app uses, including trailing slashes if needed

### Issue: "Client not found"
- **Solution**: Verify the client ID is exactly `super-shop-console` (case-sensitive)

### Issue: "User not found" or "Invalid credentials"
- **Solution**: 
  - Verify user email matches exactly (case-sensitive)
  - Check that password was set (not temporary)
  - Ensure user is in the correct realm (`super-shop`)

### Issue: "Access denied" or roles not working
- **Solution**:
  - Verify roles are assigned in "Role mapping" tab for each user
  - Check that roles mapper is enabled in client scopes
  - Ensure roles are added to access token (check token at jwt.io)

### Issue: CORS errors
- **Solution**: 
  - Verify "Web origins" includes all frontend URLs
  - Check that backend CORS_ORIGINS includes all frontend URLs

### Issue: "Where do I find the Client Secret?"
- **Solution**: 
  - For **public clients** (Client authentication: OFF), there is **no client secret** in Keycloak
  - The `KEYCLOAK_CLIENT_SECRET` in your `.env` is a placeholder value (e.g., `local-secret`)
  - Keycloak does not validate this value for public clients
  - You can use any string value - it's only required by the Passport library, not Keycloak
  - If you need a real secret, create a **confidential client** (Client authentication: ON) and use its secret

## Additional Notes

- **Client Secret for Public Clients**: 
  - The `super-shop-console` client is configured as a **public client** (Client authentication: OFF)
  - Public clients do **not** have or require a client secret in Keycloak
  - The `KEYCLOAK_CLIENT_SECRET=local-secret` in your `.env` is a placeholder value
  - Keycloak will **not validate** this secret for public clients - it's only there to satisfy the Passport library's parameter requirements
  - You can use any string value (e.g., `local-secret`, `not-used`, `placeholder`) - it doesn't matter for public clients
  
- **Alternative: Confidential Client for Backend** (Optional):
  - If you want to use a real client secret for backend authentication, you can create a separate **confidential client**:
    1. Create a new client with the same settings
    2. Set **Client authentication**: **ON** (this makes it confidential)
    3. After saving, go to the **"Credentials"** tab
    4. Copy the **"Client secret"** value
    5. Update your `.env` with this real secret value
  - Note: This is optional and only needed if you want stricter backend authentication

- **Token Lifespan**: Adjust token lifespans in client settings if you need longer/shorter sessions.

- **Email Verification**: In production, enable email verification. For development, you can skip it by toggling "Email verified" ON when creating users.

- **Password Policy**: Consider setting up password policies in Keycloak under Realm settings → Security → Password policy.

## Next Steps

After Keycloak is configured:

1. **Seed the database** with matching users:
   ```bash
   pnpm --filter @super-shop/backend-gateway prisma:seed
   ```

2. **Start the application**:
   ```bash
   pnpm dev
   ```

3. **Test login flow** at `http://localhost:4173`
