## Backend Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | HTTP port | `4000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://super_shop:super_shop_pw@localhost:5432/super_shop` |
| `KEYCLOAK_ISSUER_URL` | Keycloak realm issuer URL | `http://localhost:8080/auth/realms/super-shop` |
| `KEYCLOAK_CLIENT_ID` | OAuth2 client id | `super-shop-console` |
| `KEYCLOAK_CLIENT_SECRET` | OAuth2 client secret | `local-secret` |
| `KEYCLOAK_CALLBACK_URL` | OAuth2 callback URL | `http://localhost:4000/auth/callback` |
| `AUTH_SUCCESS_REDIRECT` | Post-login redirect | `http://localhost:4173` |
| `CORS_ORIGINS` | Comma separated list of allowed origins | `http://localhost:4173` |


