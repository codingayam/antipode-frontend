---

description: "Task list for implementing Antipode Connection Experience"
---

# Tasks: Antipode Connection Experience

**Input**: Design documents from `/specs/001-connect-antipodes/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No automated test tasks are mandated; add targeted tests only if required during implementation.

**Organization**: Tasks are grouped by user story so each slice is independently deliverable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Task can run in parallel (no dependency conflicts, distinct files)
- **[Story]**: User story label (US1, US2, US3) — omitted for shared/setup phases
- Include exact file paths in every description

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the workspace, dependencies, and shared configs for the mono-repo.

- [X] T001 Update pnpm workspace packages in `pnpm-workspace.yaml`
- [X] T002 Add Next.js + React Three Fiber dependencies in `frontend/package.json`
- [X] T003 [P] Add NestJS + Socket.IO dependencies in `backend/package.json`
- [X] T004 [P] Configure base TypeScript settings in `tsconfig.base.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish backend and frontend scaffolding required by all user stories.  
**⚠️ CRITICAL**: Complete this phase before starting any user story work.

- [X] T005 Scaffold NestJS bootstrap and module wiring in `backend/src/main.ts`
- [X] T006 [P] Create in-memory data store scaffolding with seed loader in `backend/src/data/memory-store.ts`
- [X] T007 [P] Add geospatial utility helpers using Turf in `backend/src/utils/geo.ts`
- [X] T008 Define shared DTO typings aligned with OpenAPI in `backend/src/contracts/index.ts`
- [X] T009 Initialize Next.js app shell with global providers in `frontend/src/pages/_app.tsx`
- [X] T010 [P] Configure shared API client and React Query setup in `frontend/src/services/api/client.ts`

**Checkpoint**: Backend and frontend scaffolding ready; user stories can proceed independently.

---

## Phase 3: User Story 1 - Discover Opposite-Side Community (Priority: P1) 🎯 MVP

**Goal**: Let visitors provide or detect their location, animate the globe to the antipode, and show available opposite-side members or an empty state.  
**Independent Test**: From a clean session, trigger a location search (auto or manual) and verify the globe animation, antipode label, and member list/empty message appear within 15 seconds.

### Implementation for User Story 1

- [X] T011 [US1] Add antipode request/response DTOs in `backend/src/api/antipode/dto/search.dto.ts`
- [X] T012 [US1] Implement antipode computation logic in `backend/src/api/antipode/antipode.service.ts`
- [X] T013 [US1] Expose `/antipode/search` handler in `backend/src/api/antipode/antipode.controller.ts`
- [X] T014 [US1] Populate antipode lookup helpers in `backend/src/data/memory-store.ts`
- [X] T015 [P] [US1] Implement location detector utilities in `frontend/src/services/location/detector.ts`
- [X] T016 [P] [US1] Build animated globe component in `frontend/src/components/globe/AntipodeGlobe.tsx`
- [X] T017 [US1] Create antipode search hook integrating API + cache in `frontend/src/hooks/useAntipodeSearch.ts`
- [X] T018 [US1] Assemble discovery page flow in `frontend/src/pages/index.tsx`
- [X] T019 [US1] Implement ocean/empty fallback UI in `frontend/src/components/antipode/EmptyState.tsx`
- [X] T020 [US1] Render member cards in `frontend/src/components/antipode/MatchList.tsx`

**Checkpoint**: User Story 1 delivers a fully functional antipode discovery experience.

#### Parallel Examples (US1)

```bash
# UI build-out in parallel once DTO/service work begins
Task T015 (location detector) and Task T016 (globe component)

# Result rendering components in parallel
Task T019 (empty state) and Task T020 (match list)
```

---

## Phase 4: User Story 2 - Start Conversation With Antipode User (Priority: P2)

**Goal**: Allow matched users to initiate and continue conversations with opposite-side members in real time.  
**Independent Test**: Using two sessions, start a conversation from the match list, confirm both participants see the thread, and verify the inactive recipient badge appears when one user is offline.

### Implementation for User Story 2

- [X] T021 [US2] Define conversation DTOs following contracts in `backend/src/api/conversations/dto/conversation.dto.ts`
- [X] T022 [US2] Extend in-memory store with thread/message collections in `backend/src/data/memory-store.ts`
- [X] T023 [US2] Implement conversation service for create/list operations in `backend/src/api/conversations/conversations.service.ts`
- [X] T024 [US2] Wire REST endpoints for `/conversations` in `backend/src/api/conversations/conversations.controller.ts`
- [X] T025 [US2] Add Socket.IO gateway for messaging delivery in `backend/src/realtime/messaging.gateway.ts`
- [X] T026 [P] [US2] Implement conversation API hooks in `frontend/src/services/api/conversations.ts`
- [X] T027 [P] [US2] Create conversation state manager in `frontend/src/state/conversation-store.ts`
- [X] T028 [US2] Build conversation thread UI in `frontend/src/components/conversations/ConversationThread.tsx`
- [X] T029 [US2] Implement message composer with validation in `frontend/src/components/conversations/MessageComposer.tsx`
- [X] T030 [US2] Trigger conversation creation from match list items in `frontend/src/components/antipode/MatchListItem.tsx`
- [X] T031 [US2] Surface inbox badge for unread threads in `frontend/src/components/conversations/InboxBadge.tsx`

**Checkpoint**: User Story 2 enables full conversation lifecycle independent of other stories.

#### Parallel Examples (US2)

```bash
# Backend + frontend hooks in parallel after DTOs exist
Task T026 (API hooks) and Task T027 (state manager)

# UI components in parallel once state ready
Task T028 (thread UI) and Task T029 (composer)
```

---

## Phase 5: User Story 3 - Manage Antipode Presence (Priority: P3)

**Goal**: Give members control over visibility, availability, and introductory text while ensuring listings respect those preferences.  
**Independent Test**: From a signed-in session, update availability to “temporarily unavailable,” refresh the discovery list to confirm the user no longer appears, and restore availability to verify reappearance.

### Implementation for User Story 3

- [ ] T032 [US3] Define member profile DTOs in `backend/src/api/members/dto/member.dto.ts`
- [ ] T033 [US3] Add availability change tracking in `backend/src/data/memory-store.ts`
- [ ] T034 [US3] Implement member preference service in `backend/src/api/members/members.service.ts`
- [ ] T035 [US3] Expose `/members/me` GET/PATCH endpoints in `backend/src/api/members/members.controller.ts`
- [ ] T036 [P] [US3] Implement member profile data hook in `frontend/src/hooks/useMemberProfile.ts`
- [ ] T037 [US3] Create settings page UI in `frontend/src/pages/settings/index.tsx`
- [ ] T038 [P] [US3] Build availability toggle component in `frontend/src/components/settings/AvailabilityToggle.tsx`
- [ ] T039 [P] [US3] Build intro editor component in `frontend/src/components/settings/IntroEditor.tsx`
- [ ] T040 [US3] Refresh antipode listing logic for availability changes in `frontend/src/hooks/useAntipodeSearch.ts`

**Checkpoint**: User Story 3 delivers self-service presence management while preserving discovery integrity.

#### Parallel Examples (US3)

```bash
# UI controls in parallel after data hook exists
Task T038 (availability toggle) and Task T039 (intro editor)

# Backend preference updates parallel with frontend hook
Task T033 (change tracking) and Task T036 (profile hook)
```

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Harden performance, documentation, and observability across the feature.

- [ ] T041 Update quickstart with messaging and settings workflows in `specs/001-connect-antipodes/quickstart.md`
- [ ] T042 [P] Document manual validation scenarios in `specs/001-connect-antipodes/testing.md`
- [ ] T043 Improve backend error logging filter in `backend/src/middleware/error.filter.ts`
- [ ] T044 [P] Capture key analytics events for discovery and messaging in `frontend/src/services/analytics/events.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Phase 1 – Setup** → No prerequisites.
2. **Phase 2 – Foundational** → Depends on Phase 1 completion; blocks all user stories.
3. **Phase 3 – User Story 1 (P1)** → Depends on Phase 2; highest priority MVP.
4. **Phase 4 – User Story 2 (P2)** → Depends on Phase 2; can begin after or alongside US1 once shared pieces stable.
5. **Phase 5 – User Story 3 (P3)** → Depends on Phase 2; may run parallel with US2 after APIs stabilize.
6. **Phase 6 – Polish** → Depends on all targeted user stories being feature-complete.

### User Story Dependencies

- **US1 → Discovery**: Independent once foundation ready.
- **US2 → Messaging**: Requires US1 data structures but no hard runtime dependency; coordinate on shared components.
- **US3 → Presence**: Relies on memory store scaffolding and listing refresh logic from US1.

### Critical Internal Dependencies

- T012 and T013 depend on T006–T008.
- Frontend hooks (T017, T026, T036) depend on API clients from Phases 2 and respective DTO tasks.
- Availability refresh (T040) depends on US3 backend tasks (T033–T035).

---

## Parallel Execution Opportunities

- **Setup & Foundation**: Tasks marked [P] (T003, T004, T006, T007, T010) can proceed concurrently once prerequisites in the same phase are satisfied.
- **User Story 1**: UI tasks T015, T016, T019, T020 parallelize while backend endpoints finalize.
- **User Story 2**: T026 and T027 in parallel; T028 and T029 parallel once state ready.
- **User Story 3**: T038 and T039 parallel after T036; backend change tracking (T033) can progress alongside frontend prep.
- **Polish**: Documentation (T042) and analytics (T044) can run simultaneously.

---

## Implementation Strategy

### MVP First (Deliver US1)

1. Complete Phases 1 and 2 to lay groundwork.
2. Execute Phase 3 (US1) and validate the antipode discovery flow end-to-end.
3. Demo or release MVP once US1 passes independent testing criteria.

### Incremental Delivery

1. Foundation done → Deliver US1 (discovery).  
2. Layer in US2 (messaging) and validate with paired sessions.  
3. Add US3 (presence management) to close the loop on member controls.  
4. Finish with Phase 6 polish items before broader release.

### Parallel Team Strategy

1. Small team handles Phases 1–2 collectively.  
2. After foundation: assign US1 to globe/UI specialist, US2 to real-time backend/front-end pair, US3 to account/settings owner.  
3. Coordinate via memory-store contracts and shared hooks; integrate during checkpoints.
