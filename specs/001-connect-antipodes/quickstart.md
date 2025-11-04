# Quickstart: Antipode Connection Experience

## Prerequisites

- Node.js 20.x (LTS) and pnpm 9.x  
- Docker (optional) for local infra orchestration  
- Recommended: Redis (optional) if experimenting with socket scaling (not required for prototype)

## Initial Setup

```bash
pnpm install
cp .env.example .env.local    # fill in runtime secrets, map API keys
pnpm seed:memory              # loads in-memory fixtures for members and antipode snapshots
```

## Running Services

### Backend API & WebSocket gateway

```bash
pnpm --filter backend dev
```

This starts the NestJS server on `http://localhost:4000` and a Socket.IO namespace at `/messaging`.

### Frontend (Next.js)

```bash
pnpm --filter frontend dev
```

The app runs on `http://localhost:3000`, fetching API data from the backend dev server.

## Testing

```bash
pnpm test                      # runs Jest unit suites (frontend + backend)
pnpm test:e2e                  # launches Playwright flows covering globe + messaging
pnpm test:contracts            # executes Pact + Supertest contract suites
```

## Linting & Formatting

```bash
pnpm lint                      # ESLint across monorepo
pnpm format                    # Prettier formatting
```

## Helpful Scripts

- `pnpm seed:reset` — reloads in-memory fixtures during development.
- `pnpm analyze:perf` — runs Lighthouse + performance scripts targeting SC-001/SC-003 metrics.

## Environment Notes

- Globe rendering relies on WebGL 2.0; use Chrome/Firefox/Safari latest for testing.  
- Location services require HTTPS even in staging; use `mkcert` or a dev proxy when testing device geolocation.  
- Messaging notifications surface via in-app toasts and inbox badges; ensure multiple browser sessions when validating real-time flows.
