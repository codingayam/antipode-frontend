# Feature Specification: Antipode Connection Experience

**Feature Branch**: `[001-connect-antipodes]`  
**Created**: 2025-11-03  
**Status**: Draft  
**Input**: User description: "A web app that is based on the idea of connecting people who are living on opposite poles of earth and in all likelihoods, will never meet each other in this life. The interface should show a nice spinning globe - the user enters their location or allows the device to detect their live location. They hit enter, the globe spins and lands on the opposite end of wherever their location was. It will then show people who have signed up for the app and are using it. The user can choose to connect with anyone and send messages."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover Opposite-Side Community (Priority: P1)

Visitors want to instantly see who lives on the opposite side of the planet from their current or chosen spot so they can decide whether to join the community.

**Why this priority**: Without a fast way to reveal the antipode location and people there, the core promise of the product is unmet and users will leave.

**Independent Test**: A tester can impersonate a visitor, input or share a location, watch the globe animate to the antipode, and confirm a list of opposite-side users appears with key info.

**Acceptance Scenarios**:

1. **Given** a first-time visitor with location sharing enabled, **When** they grant permission and trigger the search, **Then** the globe animates to the antipode point, displays the antipode place name, and shows available user profiles anchored to that area.
2. **Given** a returning visitor who prefers manual input, **When** they enter a city or coordinates and submit, **Then** the globe animates to the calculated antipode and the interface lists available opposite-side members or communicates that none are currently active.

---

### User Story 2 - Start Conversation With Antipode User (Priority: P2)

Matched users want to initiate direct communication with someone at their antipode so they can build a unique connection.

**Why this priority**: Messaging delivers the social value that differentiates the platform; without it, discovery yields no lasting engagement.

**Independent Test**: A tester can select a listed antipode member, send a message, and verify both parties see the conversation thread and receive notifications within the app.

**Acceptance Scenarios**:

1. **Given** a signed-in user viewing antipode matches, **When** they choose a profile and send an introductory message, **Then** a conversation thread opens that records the message, flags the recipient’s status, and allows continued replies from both parties.
2. **Given** the recipient is not currently active, **When** a new message arrives, **Then** the app surfaces an in-experience notification or inbox badge on their next visit so they can respond without delay.

---

### User Story 3 - Manage Antipode Presence (Priority: P3)

Existing members want to control how they appear to opposite-side visitors, including availability, introduction text, and preferred contact boundaries.

**Why this priority**: Empowering members to manage visibility builds trust and keeps the community healthy while preventing unwanted outreach.

**Independent Test**: A tester can update the availability toggle and intro message, refresh the opposite-side listing, and verify the changes are reflected immediately for prospective connections.

**Acceptance Scenarios**:

1. **Given** a member has updated their availability to “temporarily unavailable,” **When** an opposite-side visitor loads the match list, **Then** the member either does not appear or is clearly marked as unavailable with no option to start a new chat.

---

### Edge Cases

- Locations whose antipode falls in the ocean or an uninhabited zone must present the nearest populated area alternative and invite the user to follow related communities.
- Device location access is declined or fails; the experience should fall back to manual input without losing progress.
- Visitors attempt to message a user who has gone offline or withdrawn consent; the system must prevent new messages and advise the visitor of the status change.
- Two visitors trigger the same antipode simultaneously; ensure the globe animation and data loads remain responsive without conflicting state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The experience MUST allow visitors to either grant real-time location access or submit a manual location (city, address, or coordinates) before starting the search.
- **FR-002**: The globe visualization MUST animate from the visitor’s location to the calculated antipode within three seconds of submission.
- **FR-003**: The system MUST calculate the antipode location, label it with understandable geography (nearest city/region), and display it alongside context text.
- **FR-004**: The interface MUST present profiles of members associated with the antipode location, including name/alias, availability status, and a short introduction.
- **FR-005**: Signed-in users MUST be able to initiate a conversation with a listed member, including composing the first message and sending it to that member’s inbox.
- **FR-006**: Recipients MUST be notified inside the app of new messages and be able to reply within the same conversation thread.
- **FR-007**: Members MUST be able to update their visibility and availability preferences, and those changes MUST immediately reflect in visitor-facing lists.
- **FR-008**: When no members are available at the antipode, the system MUST communicate the empty state and offer next steps (e.g., invite friends, follow updates).

### Key Entities *(include if feature involves data)*

- **Visitor Location**: Represents the geographic point provided by a visitor (manual or detected), including latitude/longitude, display label, and timestamp of capture.
- **Antipode Profile Listing**: Represents the set of member summaries surfaced for a given antipode query, including member identifier, display name, availability flag, and distance from the exact antipode.
- **Conversation Thread**: Represents the chronological message exchange between two members, including participants, message content metadata (sender, timestamp, read state), and current status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% of visitors reach an antipode result (animation plus match list or empty-state message) within 15 seconds of submitting a location.
- **SC-002**: 95% of location submissions (manual or detected) produce an antipode label that users rate as accurate or understandable in post-session feedback.
- **SC-003**: At least 60% of visitors who see an available antipode member start a conversation within their session.
- **SC-004**: 85% of surveyed members report satisfaction with their control over visibility and messaging availability after using the feature for one week.

## Assumptions

- Location data is stored and shown at city/region granularity so precise street addresses are never displayed to other users.
- Only registered members can appear in antipode listings or send/receive messages; casual visitors can browse but must sign up before messaging.
- Notifications for new antipode messages are delivered within the app experience; out-of-app alerts will be considered separately.
