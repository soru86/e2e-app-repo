# Architecture Overview

## Monorepo Layout

```
apps/
  backend-gateway/       # Express + Apollo + Prisma + Passport (Keycloak)
  frontend-shell/        # React host app, module federation container
  mfe-customer/          # Customer MFE (orders, payments, issues, dashboard)
  mfe-admin/             # Admin MFE (inventory, discounts, issue tracker)
packages/
  theme/                 # Tailwind preset + ThemeProvider (light/dark)
  ui/                    # Shared UI primitives + chart wrappers
  config/                # Runtime configuration + env guards
  graphql-client/        # Apollo client factory with auth middleware
  shared-types/          # Types shared between FE/BE (GraphQL, domain)
  state/                 # Redux Toolkit slices/hooks shared by MFEs
infra/
  k8s/                   # Deployments, Services, HPAs, ServiceMonitor
.github/workflows/       # CI/CD pipelines
```

## Data Flow

1. **Auth**: Users authenticate against Keycloak (OIDC). Frontends leverage `@react-keycloak/web` to fetch tokens, which are forwarded as Bearer tokens to the backend. Passport `KeycloakStrategy` verifies tokens and maps roles (`customer`, `admin`).
2. **API**: Frontends call GraphQL via Apollo Client (`packages/graphql-client`). Resolver layer uses Prisma to read/write Postgres tables (inventory, orders, payments, discounts, issues).
3. **State**: Each MFE has its own Redux store composed with shared slices from `packages/state`. Apollo cache supplies server state, while Redux handles UI state (filters, wizards, theme overrides).
4. **UI Composition**: `frontend-shell` uses Module Federation (Vite plugin) to mount remote MFEs at runtime based on role-based routing. Shared packages are consumed via workspace aliases to avoid version drift.
5. **Observability**: Backend exposes `/metrics` (Prometheus), structured logging (Pino), and health checks. Frontends emit Web Vitals events via GraphQL mutation for long-term storage.

## Key Modules

- **Inventory**: CRUD for items, stock levels, replenishment thresholds.
- **Orders**: Cart, order placement, order history, order fulfillment pipeline.
- **Billing**: Quote generation, discount application, printable receipts.
- **Discounts**: Rule engine (percentage, flat, BOGO) applied during checkout.
- **Issues**: Customer issue submission + status tracking, admin issue board.
- **Payments**: Mock PSP integration storing payment attempts/history.

## Non-Functional Considerations

- **Scalability**: Each app packaged into its own Docker image and deployable Pod. HPA configuration scales on CPU > 60% or custom Prometheus metrics.
- **Security**: OAuth2/OIDC via Keycloak, Passport middleware on backend, role-based schema directives guard GraphQL fields.
- **CI/CD**: GitHub Actions pipeline enforces lint/test/build, then publishes Docker images + applies manifests.
- **Testing**: Vitest + React Testing Library for MFEs, Vitest for Node backend. Coverage thresholds locked at 100% to highlight gaps early.

## Future Enhancements

- Add dedicated analytics MFE for executive dashboards.
- Integrate service mesh (Istio/Linkerd) for zero-trust networking.
- Introduce contract testing between MFEs and backend GraphQL schema via Pact.
- Expand observability with OpenTelemetry traces exported to Tempo/Jaeger.
