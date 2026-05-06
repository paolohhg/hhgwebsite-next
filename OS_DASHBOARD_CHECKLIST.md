# Heard OS Dashboard Checklist

Build plan for `/os` as the primary HHG project management dashboard. Work one component at a time, in the order below, so the app becomes useful before it becomes broad.

## Product Frame

`/os` is the working home for HHG project management. It should answer four daily questions quickly:

- What needs attention today?
- Which projects are active, blocked, or drifting?
- What is Paolo responsible for, what is Mel responsible for, and what is shared?
- Which sellable assets or systems are ready, unfinished, or stale?

The dashboard should stay private, mobile-usable, and operational. Avoid marketing copy inside `/os`; every screen should help Paolo or Mel make a decision or update the source of truth.

## Existing Foundation

- [x] Private `/os` route group with noindex metadata
- [x] Supabase magic-link auth with allowlist enforcement
- [x] Paolo and Chef Mel defined as the first authorized dashboard users
- [x] Shared `/os` layout and navigation
- [x] Overview page with stat rows and active lists
- [x] Projects list, create form, edit/detail page, delete action
- [x] Tasks list, create form, status toggle, delete action
- [x] Assets list, create form, status select, delete action
- [x] Shared nutrition-label UI primitives: `Section`, `Stat`, `Field`, `SelectField`, `TextareaField`, `PrimaryButton`, `GhostButton`

## Build Schedule

### 1. Dashboard Shell

Goal: make `/os` feel like the main operating home, not a collection of CRUD pages.

- [x] Add a current-date header with a concise operational title
- [x] Add a "Today" band for overdue tasks, due-today tasks, and doing tasks
- [x] Add a calendar preview for dated work
- [x] Add a "Next Actions" band from active project `next_action` fields
- [x] Add a "Stale Projects" band for active projects that have not been updated recently
- [x] Add empty states that tell the user what action to take next
- [x] Preserve the black-and-white nutrition-label aesthetic
- [ ] Verify mobile width with no horizontal scroll

Primary files:

- `src/app/os/(app)/page.tsx`
- `src/app/os/(app)/layout.tsx`
- `src/app/os/_components/ui.tsx`

Acceptance:

- [x] `/os` is the first place a user can land and know what to do next
- [x] At least three priority sections are visible without drilling into a subpage
- [x] Empty data still produces a useful dashboard

### 2. Shared UI Components

Goal: reduce repeated row/form markup before expanding the dashboard.

- [ ] Create a reusable page header component
- [ ] Create a reusable action disclosure/form shell
- [ ] Create a reusable metadata row pattern for project/task/asset list items
- [ ] Create a reusable destructive action style
- [ ] Keep components server-friendly unless client behavior is required

Primary files:

- `src/app/os/_components/ui.tsx`
- Existing `/os/(app)/*/page.tsx` files as consumers

Acceptance:

- [ ] Existing pages read cleaner and share the same interaction language
- [ ] No visible UI regression on projects, tasks, or assets
- [ ] Component names describe operational use, not visual decoration

### 3. Project Components

Goal: make projects the backbone of the PM system.

- [ ] Add `health`: on-track, at-risk, blocked, paused
- [ ] Add `priority`: urgent, high, normal, low
- [ ] Add `target_date` and optional `start_date`
- [ ] Add `blocked_reason`
- [ ] Surface owner, revenue tier, status, and next action consistently
- [ ] Add a project detail summary before the edit form
- [ ] Move linked tasks higher in the detail page, grouped by status
- [ ] Add a quick task creation path from the project detail page
- [ ] Consider adding blocked/at-risk language before adding more statuses

Primary files:

- `src/app/os/(app)/projects/page.tsx`
- `src/app/os/(app)/projects/[id]/page.tsx`
- `src/app/os/(app)/projects/actions.ts`
- `src/lib/os/types.ts`

Acceptance:

- [ ] A project page shows current state before edit controls
- [ ] User can decide the next project action within 10 seconds
- [ ] Project-linked tasks are easy to create and scan

### 4. Task Components

Goal: make tasks fast enough for daily use on phone or desktop.

- [ ] Split tasks into Today, Doing, Open, Waiting/Blocked if added, and Done
- [ ] Add `priority`: urgent, high, normal, low
- [ ] Add `blocked_reason`
- [ ] Add `updated_at` or equivalent last-touched signal
- [ ] Add due-today and overdue styling without adding pills/badges
- [ ] Add project filter or owner filter if the list becomes long
- [ ] Add edit task support, not only create/toggle/delete
- [ ] Add quick assignment switching between Paolo and Mel
- [ ] Confirm tap targets are at least 40px on mobile

Primary files:

- `src/app/os/(app)/tasks/page.tsx`
- `src/app/os/(app)/tasks/actions.ts`
- `src/lib/os/types.ts`

Acceptance:

- [ ] Tasks can be updated without deleting and recreating them
- [ ] Overdue and due-today work is unmistakable
- [ ] Mobile interaction is comfortable in real kitchen/transit use

### 5. Asset Components

Goal: make assets useful as sellable/productized inventory, not just a list.

- [ ] Clarify asset categories and statuses for HHG's real sales process
- [ ] Add `owner` if asset follow-up belongs to Paolo or Mel
- [ ] Add `price` or `revenue_value` only once asset monetization language is clear
- [ ] Add `last_reviewed_at` to keep sellable inventory from going stale
- [ ] Add an asset detail/edit view if notes and links become important
- [ ] Add status-change history only if needed after daily use
- [ ] Make Drive links easy to open while preserving private posture
- [ ] Surface ready-to-sell assets on `/os` overview

Primary files:

- `src/app/os/(app)/assets/page.tsx`
- `src/app/os/(app)/assets/actions.ts`
- `src/app/os/(app)/assets/status-select.tsx`
- `src/lib/os/types.ts`

Acceptance:

- [ ] Ready-to-sell assets are visible from the home dashboard
- [ ] Asset status can be changed quickly and confidently
- [ ] Asset fields reflect actual HHG inventory language

### 6. Data Model Pass

Goal: adjust the schema only after the UI proves which fields matter.

- [ ] Add project fields: `priority`, `health`, `start_date`, `target_date`, `blocked_reason`
- [ ] Add task fields: `priority`, `blocked_reason`, `updated_at`
- [ ] Add asset fields after workflow validation: `owner`, `price`, `customer`, `last_reviewed_at`
- [ ] Write forward and rollback SQL before applying schema changes
- [ ] Update `src/lib/os/types.ts` and all affected forms together

Primary files:

- `src/lib/os/types.ts`
- Supabase SQL migrations or documented SQL snippets
- Affected action files

Acceptance:

- [ ] Every new field has a visible use in the UI
- [ ] No schema-only fields are added "just in case"
- [ ] Rollback SQL exists for every schema change

### 7. User Components and Access

Goal: keep the app simple while making Paolo/Mel usage explicit.

- [x] Keep Paolo and Chef Mel as the first auth login emails
- [ ] Keep allowlist as the source of access if there is a real team expansion need
- [ ] Add user-aware views only where they reduce clutter, such as "My Tasks"
- [ ] Confirm Mel's mobile login and first-task flow
- [ ] Add lightweight role language only if permissions diverge later

Primary files:

- `src/app/os/(app)/layout.tsx`
- `src/app/os/login/*`
- `src/lib/supabase/*`

Acceptance:

- [ ] Paolo and Mel can both sign in and use the same dashboard
- [ ] The signed-in user's email is visible but not visually dominant
- [x] Access errors are understandable without exposing allowlist details

### 8. Verification Pass

Goal: make each component safe to ship before moving to the next.

- [x] Run `npm run lint`
- [x] Run `npm run build`
- [x] Smoke test `/os/login` unauthenticated
- [x] Smoke test `/os` redirect behavior unauthenticated
- [ ] Test mobile layout at narrow width
- [ ] Test create/edit/delete flows against Supabase when env is available
- [ ] Update `STATUS.md` after runtime state changes

## Component Work Rule

For each component or route:

1. Define the job of the component in one sentence.
2. Implement the smallest useful version.
3. Verify desktop and mobile layout.
4. Run lint/build.
5. Mark the checklist item complete only after the UI is usable, not merely present.

## Current Priority

Start with **1. Dashboard Shell**, then **2. Shared UI Components**. Those two steps create the operating surface and reduce duplication before projects, tasks, and assets get more features.

## Missing Must-Haves Captured

- [ ] Priority levels for tasks and projects
- [ ] Blocked status or blocker reason
- [ ] Project target dates
- [ ] Task editing
- [ ] Project health
- [ ] Last-updated/stale-work signals
- [ ] My Tasks or owner filter
- [ ] Search and filters once lists grow
- [ ] Comments or update log after the single notes field proves insufficient
- [ ] Attachments or links on projects and tasks
- [ ] Recurring tasks for weekly/monthly operating routines
- [ ] Milestones for larger projects
- [ ] Calendar view after due-date volume justifies it
- [x] Calendar link in sidebar
- [x] Calendar page with month preview
- [ ] Archive/completed-project handling
