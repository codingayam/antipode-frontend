# Research Summary: Antipode Connection Experience

## Tasks Issued

- Research language/runtime alignment for a globe-centric web experience.
- Research primary libraries for 3D globe rendering, geospatial antipode calculations, and real-time messaging.
- Research storage options for geospatial matching plus threaded messaging.
- Research test tooling to validate globe interactions, API flows, and messaging threads.
- Research deployment targets, performance envelopes, core constraints, and anticipated scale for launch.

## Findings

### Language / Runtime

- **Decision**: Adopt TypeScript 5.x across frontend (Next.js runtime) and backend (Node.js 20 LTS with NestJS).  
- **Rationale**: Provides shared typing between UI and API contracts, strong ecosystem support for WebGL integration, and mature tooling for real-time messaging stacks. Node 20 LTS offers stable WebSocket support and native test runners if desired.  
- **Alternatives considered**: Python (FastAPI) lacked direct synergy with WebGL-centric frontend; Go provides high performance but sacrifices end-to-end type sharing and increases staffing ramp time.

### Primary Dependencies

- **Decision**: Frontend uses Next.js + React, `@react-three/fiber` with `three` for globe animation, and `react-query` for data fetching; backend uses NestJS, `socket.io` for bidirectional messaging, and `@turf/turf` for antipode geospatial math.  
- **Rationale**: Next.js streamlines SSR/SSG, crucial for SEO and fast first paint; React Three Fiber integrates Three.js declaratively; turf provides accurate antipode/geodesic utilities; NestJS plus socket.io gives structured modules and WebSocket abstraction.  
- **Alternatives considered**: SvelteKit (lighter footprint) but team familiarity assumed lower; D3 globe plugins require more custom WebGL plumbing; raw WebSocket handling in Express would reduce structure and testability.

### Storage

- **Decision**: Defer persistent storage; prototype relies on in-memory data stores with seed fixtures refreshed per session.  
- **Rationale**: Aligns with updated constraint to avoid introducing any database until stakeholder approves a persistence strategy; keeps focus on validating UX and messaging flows.  
- **Alternatives considered**: MongoDB and PostgreSQL postponed; file-based persistence rejected due to concurrency limitations and potential data leakage risks.

### Testing Strategy

- **Decision**: Use Jest + Testing Library for component/unit tests, Playwright for end-to-end globe + messaging flows, and Pact (or NestJS e2e runner with Supertest) for contract validation between frontend and API.  
- **Rationale**: Jest ecosystem mature with TypeScript; Playwright handles WebGL canvas verification and multi-user messaging flows; contract tests prevent drift between typed DTOs.  
- **Alternatives considered**: Cypress lacks first-class multi-browser automation; Vitest provides speed but weaker ecosystem for React Three Fiber debugging; manual QA deemed insufficient for globe edge cases.

### Target Platform

- **Decision**: Deploy backend services in containerized Linux (Ubuntu 22.04) environment, expose frontend via static/edge hosting (Next.js SSR on Node runtime), and support modern desktop/mobile browsers with WebGL 2.0 capability.  
- **Rationale**: Linux containers align with common CI/CD; Next.js SSR requires Node runtime; WebGL 2 ensures smooth globe rendering; limiting to modern browsers simplifies QA.  
- **Alternatives considered**: Serverless (Lambda) rejected due to persistent WebSocket needs; legacy browser support would inflate testing surface without clear ROI.

### Project Type

- **Decision**: Full-stack web application with discrete `frontend/` (Next.js) and `backend/` (NestJS) projects managed in a mono-repo.  
- **Rationale**: Matches planned directory structure, encourages separation of concerns while enabling shared TypeScript packages.  
- **Alternatives considered**: Single Next.js app with API routes would complicate websocket scaling; microservice split unnecessary at current scope.

### Performance Goals

- **Decision**: Backend antipode lookup + profile retrieval median < 800 ms, messaging round-trip latency < 1 second for 95th percentile, globe animation renders at ≥ 45 FPS on mid-tier devices, and overall request-to-result time ≤ 10 seconds to satisfy SC-001 buffer.  
- **Rationale**: Provides actionable engineering targets underpinning success criteria while leaving room for network variance; ensures animation smoothness.  
- **Alternatives considered**: Tighter 500 ms backend SLA deemed risky without CDN caching; looser thresholds risk missing business success targets.

### Constraints

- **Decision**: Enforce city-level granularity for shared locations, implement GDPR-compliant consent for location capture, require TLS everywhere, and acknowledge that persistence is deferred (prototype data resets on deploy).  
- **Rationale**: Maintains privacy posture and legal compliance while embracing the storage deferment; ensures all contributors understand data is ephemeral.  
- **Alternatives considered**: Persisting prototype data risks stale or sensitive information lingering; introducing databases now adds operational burden without confirmed product-market fit.

### Scale / Scope

- **Decision**: Design for 50k registered members with 5k daily active users and up to 500 concurrent messaging sessions at launch.  
- **Rationale**: Provides sizing for infrastructure and test loads while remaining realistic for initial rollout; supports global marketing push without over-engineering.  
- **Alternatives considered**: Smaller pilot (5k users) underestimates viral potential; designing for millions now would overcomplicate MVP timelines.

## Resolution Summary

All previously marked NEEDS CLARIFICATION items now have concrete decisions with supporting rationale, enabling progression to design deliverables.
