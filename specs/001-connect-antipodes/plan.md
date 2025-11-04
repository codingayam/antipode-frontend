# Implementation Plan: Antipode Connection Experience

**Branch**: `[001-connect-antipodes]` | **Date**: 2025-11-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-connect-antipodes/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Deliver a web experience that detects or accepts a visitor’s location, animates an interactive globe to their antipode, lists opposite-side members, and enables in-app messaging while allowing members to manage visibility and availability, implemented with a TypeScript mono-repo (Next.js globe UI + NestJS messaging API) using in-memory data stores while persistent storage is deferred.

## Technical Context

**Language/Version**: TypeScript 5.x with Node.js 20 LTS runtimes (frontend and backend).  
**Primary Dependencies**: Next.js + React + React Three Fiber/Three.js; NestJS + Socket.IO; Turf.js for geospatial logic; React Query for data fetching.  
**Storage**: Deferred — prototype relies on in-memory stores refreshed per session.  
**Testing**: Jest + Testing Library for unit/UI, Playwright for end-to-end globe/messaging flows, NestJS e2e runner with Supertest + Pact for contract coverage.  
**Target Platform**: Containerized Linux backend (Ubuntu 22.04), SSR-capable Node host for Next.js, modern desktop/mobile browsers with WebGL 2.0.  
**Project Type**: Full-stack web mono-repo with discrete `frontend/` (Next.js) and `backend/` (NestJS) projects.  
**Performance Goals**: Antipode lookup median <800 ms, messaging round trip <1 s p95, globe animation ≥45 FPS, location-to-result experience ≤10 s.  
**Constraints**: City-level location sharing, explicit consent for geolocation, TLS-only transport, stateless services with ephemeral in-memory data (persistence decision pending).  
**Scale/Scope**: Target 50k registered users, 5k DAU, and 500 concurrent conversations at launch.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Pre-Phase 0: Constitution document is placeholder text with no enforceable principles. Proceeding contingent on documenting decisions defensively and avoiding scope creep. No formal gate violations detected, but governance gaps noted.
- Post-Phase 1: Design artifacts maintain user-value focus, avoid unnecessary complexity, and document privacy + scalability constraints; still awaiting formal constitution updates but no new violations introduced.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/
```

**Structure Decision**: Adopt a web-application split with `frontend/` for the globe UI and messaging client, and `backend/` for location, antipode, and messaging services; dedicated test directories enforce clear separation of concerns.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
