# Super Shop Console

An enterprise-grade, microfrontend-based monorepo for running Super Shop retail operations end-to-end. The platform covers customer, billing, inventory, discounting, ordering, issue tracking, and analytics workflows. It uses a React + Tailwind front-end stack, an Express + GraphQL back-end, Keycloak for OAuth2/OpenID Connect, PostgreSQL for data persistence, Docker/Kubernetes for deployment, and GitHub Actions for CI/CD.

## High-level Architecture

- **Apps**
  - `frontend-shell`: React host application using Module Federation + Apollo Client to compose remote microfrontends.
  - `mfe-customer`: Customer portal microfrontend (orders, payments, issues, dashboards).
  - `mfe-admin`: Shop owner portal microfrontend (inventory, orders, discounts, issue tracker, analytics).
  - `backend-gateway`: Node.js/Express GraphQL gateway with Passport (Keycloak), Prisma/PostgreSQL, billing/order/inventory logic, monitoring endpoints.
- **Shared packages**
  - `theme`: Central theme provider with light/dark palettes, Tailwind preset, and design tokens.
  - `ui`: Headless UI primitives, chart wrappers, layout components.
  - `config`: Runtime configuration helpers (Keycloak, GraphQL endpoints, feature flags).
  - `graphql-client`: Apollo Client factory with auth links + error handling.
  - `shared-types`: TypeScript types mirrored between frontends/backends.
  - `state`: Redux Toolkit slices/utilities shared across microfrontends.
- **Infra**
  - Dockerfiles for each app, `docker-compose.local.yml` for local stack (Postgres, Keycloak, backend, MFEs).
  - Kubernetes manifests with Deployments, Services, Ingress, HPA, ServiceMonitor stub.
  - GitHub Actions workflow for lint/test/build, Docker build/push, and K8s deploy via GitOps trigger.

## Quick Start

```bash
pnpm install
pnpm dev
```

See `apps/backend-gateway/.env.example` and `docker-compose.local.yml` for environment variables (Keycloak, Postgres, OAuth clients).

## Keycloak Configuration

Before running the application, you need to configure Keycloak Identity Provider:

1. **Quick Setup**: See [Keycloak Quick Reference](./docs/KEYCLOAK_QUICK_REFERENCE.md) for a checklist
2. **Detailed Guide**: See [Keycloak Setup Guide](./docs/KEYCLOAK.md) for step-by-step instructions

**Quick Start**:
- Start Keycloak: `docker-compose up keycloak -d`
- Access Admin Console: `http://localhost:8080` (admin/admin)
- Create realm `super-shop`
- Create client `super-shop-console` (public client)
- Create roles: `CUSTOMER`, `ADMIN`
- Create users matching the seeded database users (see Database Seeding section)

## Database Seeding

To populate the database with test data (2 ADMIN users, 2 CUSTOMER users, thousands of records for testing dashboards and login flow):

**Prerequisites:**
1. Ensure PostgreSQL is running (via `docker-compose up postgres` or your local PostgreSQL instance)
2. Run database migrations first:
   ```bash
   pnpm --filter @super-shop/backend-gateway prisma:migrate
   ```

**Seed the database:**
```bash
pnpm --filter @super-shop/backend-gateway prisma:seed
```

This will:
- Automatically generate Prisma Client if needed
- Clear existing data
- Create **2 ADMIN users**: `admin1@super-shop.com`, `admin2@super-shop.com`
- Create **2 CUSTOMER users**: `customer1@super-shop.com`, `customer2@super-shop.com`
- Create **2,500 inventory items** across 10 product categories
- Create **4,000 orders** distributed across the customer users
- Create **400 issues** for testing issue tracking
- Create **30 discount rules** for testing discount management

**Note**: 
- The seed script uses the default `DATABASE_URL` (`postgresql://super_shop:super_shop_pw@localhost:5432/super_shop`) if not set in your environment
- After seeding, you'll need to create these users in Keycloak with matching email addresses to enable login functionality

## Testing & Coverage

All packages use Vitest/Jest with coverage thresholds pinned at 100%. Run `pnpm test` for the entire repo or `pnpm --filter <package> test` for a specific target.

## Deployment Pipeline

The repo ships with a reference GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that: lint/tests/builds, builds container images, pushes to a registry, and applies Kubernetes manifests via `kubectl` (or emits artifacts for ArgoCD/Flux). Adjust secrets before enabling.

## Monitoring & Observability

- Backend exposes Prometheus metrics at `/metrics` and structured logs via Pino.
- Frontend logs Web Vitals to `@graphql-client` for storage/forwarding.
- K8s manifests include `ServiceMonitor` stub for Prometheus Operator integration.

For deeper documentation, see module-level READMEs within each app/package.
