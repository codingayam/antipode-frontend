# Data Model: Antipode Connection Experience

## Overview

The experience revolves around three conceptual entities—members, location snapshots, and conversations—that define feature behavior. During the current storage-free prototype, these records live in in-memory collections refreshed per session; the structure below anticipates the eventual persistence model.

## Entities

### Member
- `id` (UUID placeholder for in-memory identification)
- `email` (string, unique, required for authentication)
- `display_name` (string, 3-60 chars)
- `profile_photo_url` (string, optional)
- `home_location` (GeoJSON Point, required)
- `home_location_label` (string, city/region, required)
- `time_zone` (string, IANA identifier)
- `availability_status` (enum: `available`, `temporarily_unavailable`, `invisible`)
- `visibility_scope` (enum: `public`, `connections_only`)
- `intro_text` (string, 0-280 chars)
- `last_active_at` (timestamp)
- `created_at` / `updated_at` (timestamps captured within runtime memory)

**Rules**
- `home_location` persists at city-level precision (snap to centroid).
- Availability defaults to `available` on sign-up and must update immediately in listings.
- When `visibility_scope = invisible`, member never appears in search results.

### LocationSnapshot
- `id` (UUID placeholder)
- `user_id` (UUID, nullable — present when signed-in visitor initiates search)
- `latitude` / `longitude` (decimal, 6 dp precision)
- `source` (enum: `device`, `manual_entry`)
- `display_label` (string, derived city/region)
- `antipode_latitude` / `antipode_longitude` (decimal)
- `antipode_label` (string, nearest populated place)
- `search_context` (JSON object storing device hints or fallback strategies)
- `created_at` (timestamp)

**Rules**
- Snapshots store raw + antipode coordinates for auditing.
- Retention policy capped (e.g., 90 days) per privacy guidelines.

### AntipodeListing (materialized view or cached projection)
- `snapshot_id` (UUID, references LocationSnapshot)
- `member_id` (UUID, references Member)
- `distance_km` (numeric, distance from true antipode point)
- `availability_status` (enum, denormalized from Member)
- `intro_text` (string)
- `visibility_scope` (enum)
- `refreshed_at` (timestamp)

**Rules**
- List only members where `visibility_scope = public` and `availability_status = available`.
- `distance_km` computed using geospatial utility functions (e.g., Turf.js) with results stored alongside listings.

### ConversationThread
- `id` (UUID placeholder)
- `initiator_id` (UUID, references Member)
- `recipient_id` (UUID, references Member)
- `created_at` / `updated_at` (timestamps)
- `status` (enum: `active`, `snoozed`, `closed`)
- `last_message_at` (timestamp)
- `initiated_from_snapshot` (UUID, references LocationSnapshot, nullable)

**Rules**
- Unique constraint on (`initiator_id`, `recipient_id`, `status = active`) to prevent duplicate parallel threads.
- Closing a thread hides it from new message attempts until reactivated.

### Message
- `id` (UUID placeholder)
- `thread_id` (UUID, references ConversationThread)
- `sender_id` (UUID, references Member)
- `body` (text, max 2000 chars)
- `sent_at` (timestamp)
- `read_at` (timestamp, nullable)
- `delivery_status` (enum: `sent`, `delivered`, `read`)

**Rules**
- At least one participant must read each message within 24 hours to satisfy responsiveness metrics; use background jobs to flag stale threads.
- Messages immutable after send; moderation actions create redacted copies rather than edits.

### AvailabilityChangeLog
- `id` (UUID)
- `member_id` (UUID)
- `previous_status` / `new_status` (enum)
- `changed_at` (timestamp)
- `changed_by` (enum: `self`, `system`)

**Rules**
- Supports audit requirements and helps recompute listings if cache invalidation fails.

## Relationships
- `Member` 1..* `ConversationThread` (as initiator or recipient).
- `ConversationThread` 1..* `Message`.
- `LocationSnapshot` optionally links to `ConversationThread` for attribution.
- `AntipodeListing` references both snapshot and member; refreshed when either updates.
- `AvailabilityChangeLog` tracks many changes per member.

## Derived State & Transitions
- **Member availability**: `available` → `temporarily_unavailable` hides profile but retains thread access; `temporarily_unavailable` → `available` restores listing immediately; `invisible` removes from all discovery and blocks new thread creation.
- **Thread status**: `active` → `snoozed` when recipient auto-mutes; `snoozed` → `active` upon reply; `active` → `closed` when either party exits (prevents new messages).
- **Message delivery**: `sent` upon persistence; `delivered` when recipient opens thread (triggered via socket event); `read` when message marked seen.

## Validation Notes
- Enforce maximum one active thread pair to avoid duplicate conversations.
- Validate location inputs (range checks, geocoding fallback) before storing snapshots.
- Ensure intro text and messages pass profanity/abuse filters (future moderation service).
