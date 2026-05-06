# Roadmap — hhgwebsite-next

Prioritized list of what's next. Items leave this file when done — move them to `STATUS.md § Recent change history`.

**Priority signal:**
- **P0** — blocking; do now (currently empty)
- **P1** — important; should land soon
- **P2** — useful; when time allows
- **Awaiting Paolo input** — scoped but blocked on product decisions
- **Tech debt** — not user-facing, but compounds if ignored

Each item has: what it is, why it matters, the rollback note (where applicable), and acceptance criteria.

---

## P0 — blocking

### 1. Make `/os` the primary project management dashboard
**Why:** Paolo identified the dashboard as the priority project. `/os` already has projects, tasks, assets, and an overview, but it needs a structured component-by-component build plan before expanding.
**Plan:** Use `OS_DASHBOARD_CHECKLIST.md` as the working checklist. Build in this order: dashboard shell, shared UI components, project components, task components, asset components, data model pass, user/access components, verification pass.
**Acceptance:**
- [ ] `/os` home clearly answers what needs attention today
- [ ] Shared UI components reduce repeated row/form markup
- [ ] Projects become the backbone of the PM workflow
- [ ] Tasks are fast to update on mobile and desktop
- [ ] Assets surface ready-to-sell inventory on the home dashboard
**Rollback:** per-component revert; schema changes require paired rollback SQL before application.

---

## P1 — important, soon

### 1. Mel signs in to `/os` and validates end-to-end
**Why:** Code is shipped but the partner-side experience has not been verified. If magic-link delivery, allowlist enforcement, or the mobile UX is broken for Mel, we won't know until she tries.
**Acceptance:**
- [ ] Mel receives magic link at `chefmel@heardhospitalitygroup.com`
- [ ] Link opens `/os` (not the login page) on her phone
- [ ] She can create a project, create a task linked to that project, mark a task done, log out
- [ ] Mobile layout is usable — no horizontal scroll, tap targets ≥40px
**Rollback:** none needed — read-only validation.
**Owner:** Paolo (coordinate with Mel).

### 2. Add OG image at `public/og-default.png`
**Why:** Currently any URL share (Slack, iMessage, Twitter, LinkedIn) shows a text-only preview. Lovable's image was removed; nothing replaced it. Bad first impression.
**Acceptance:**
- [ ] 1200×630 PNG with HHG branding placed at `public/og-default.png`
- [ ] Add to `src/app/layout.tsx` root metadata: `openGraph.images: ["/og-default.png"]` and `twitter.images: ["/og-default.png"]`
- [ ] Verify by sharing the URL in Slack/iMessage and seeing the image render
**Rollback:** revert the metadata commit; image file can stay (unused is harmless).
**Owner:** unblocked once image asset exists.

### 3. Per-page OpenGraph + Twitter metadata
**Why:** Currently every page inherits the root template's generic OG description. Each page should have its own OG title/description tuned to that page's intent. Higher CTR from social shares of specific pages.
**Acceptance:** for each of `/about-…`, `/ai-revenue-systems`, `/hospitality-ai-consulting`, `/heard-os`, `/contract-forge`, add `openGraph: { title, description }` and `twitter: { card, title, description }` to the page's `metadata` export.
**Rollback:** per-file revert; safe (no behavioral change).
**Effort:** ~30 min.
**Depends on:** P1 #2 (so the per-page OG can override the image too).

### 4. Delete legacy GitHub repo `paolohhg/stability-grid-pro`
**Why:** Source of confusion (search results, Vercel imports may try to reattach). Vercel project is already deleted; the GitHub repo is the last remnant.
**Acceptance:**
- [ ] Visit https://github.com/paolohhg/stability-grid-pro/settings → Danger Zone
- [ ] Click "Delete this repository", type `paolohhg/stability-grid-pro` to confirm
- [ ] Verify https://github.com/paolohhg/stability-grid-pro returns 404
**Rollback:** GitHub keeps deleted repos recoverable for ~90 days via Support contact. After that, gone.
**Owner:** Paolo (manual; no `gh` CLI installed).

---

## P2 — useful, when time allows

### 5. Properly fix the `date-fns` / `react-day-picker` peer-dep conflict
**Why:** Currently masked by `.npmrc` with `legacy-peer-deps=true`. Works, but every contributor (and every fresh install) carries the lie. Future deps may fail in subtle ways.
**Options:**
- Upgrade `react-day-picker` from `^8.10.1` to `^9.x` (supports `date-fns@4`). Has breaking API changes — wherever `react-day-picker` is used must be checked.
- Downgrade `date-fns` from `^4.1.0` to `^3.x`. Safer if `date-fns@4`-specific features aren't used.
**Acceptance:**
- [ ] Pick option, apply, verify `npm install` (no `--legacy-peer-deps`) succeeds
- [ ] Verify any calendar/date-picker UI still renders + works
- [ ] Remove `legacy-peer-deps=true` line from `.npmrc` (or delete the file if it becomes empty)
- [ ] Push and verify Vercel build succeeds without flag
**Rollback:** revert the upgrade/downgrade commit and re-add `legacy-peer-deps=true` to `.npmrc`.

### 6. Resolve suppressed TypeScript errors in `src/components/ui/chart.tsx` and `src/components/ui/resizable.tsx`
**Why:** Currently bypassed via `next.config.ts` setting `typescript.ignoreBuildErrors: true` (or similar). These are upstream version mismatches in shadcn-generated files (recharts v3 API change, react-resizable-panels v4 API change). Hides real type errors elsewhere.
**Acceptance:**
- [ ] Re-generate the affected shadcn components against the current dep versions, OR pin shadcn deps to versions whose API matches the existing component code
- [ ] Verify `npx tsc --noEmit` is clean
- [ ] Set `typescript.ignoreBuildErrors: false` (or remove the override)
- [ ] Verify Vercel build still succeeds
**Rollback:** revert; re-enable `ignoreBuildErrors`.

### 7. Add rate limiting to `/api/contractforge/generate`
**Why:** Currently anyone can hit this endpoint and use Paolo's Anthropic credits. At Haiku 4.5 prices it's ~$0.01–$0.03 per generation; a malicious or buggy script could rack up real cost.
**Options:** Vercel KV + sliding-window limiter; Upstash; in-memory limit per Vercel function instance (lossy but free); Cloudflare Turnstile (captcha).
**Acceptance:**
- [ ] Per-IP limit of e.g. 10 generations per hour
- [ ] Returns HTTP 429 with helpful message when exceeded
- [ ] Logs hit count to Vercel logs for monitoring
**Rollback:** revert the route file; remove KV/storage if added.

### 8. Stream ContractForge responses
**Why:** Current non-streaming UX shows a blank screen for 30–60s on a long contract. Streaming chunks let the user see the contract render progressively; also avoids timeout risk on edge cases.
**Acceptance:**
- [ ] Server route uses `client.messages.stream(...)` and returns a `ReadableStream`
- [ ] Client reads the stream, accumulates text, and updates the preview live
- [ ] Smoke test: long generation feels responsive
**Rollback:** revert both server-route and client-component commits.

### 9. Move ContractForge prompt construction server-side
**Why:** Currently the entire generated prompt (~3KB) is built client-side and POSTed to the API route. The API accepts arbitrary prompt text — anyone hitting the endpoint can use it for any purpose. Server-side prompt construction (accept only form fields, build the prompt on the server) closes that.
**Depends on:** P2 #7 (rate limiting also helps but doesn't fully solve).
**Acceptance:**
- [ ] API route accepts a typed payload (`brand`, `partyA`, `partyB`, `terms`, `contractType`)
- [ ] Server route builds the prompt from those fields
- [ ] Client only sends form data
- [ ] Both code paths (current generic `{prompt}` and new typed) work during transition, OR cut over cleanly with no version skew
**Rollback:** revert the route change; client falls back to old prompt-on-client behavior.

---

## Awaiting Paolo input

Items scoped but blocked. Will become P1/P2 once Paolo provides direction. **"Defer" in this file means "wait for more information"** — not "decide later not to do."

### A. Catering pricing calculator
**What's needed from Paolo:**
- Inputs (headcount + date + menu tier? Or richer — dietary, service style, location?)
- Output (number on screen? PDF quote? Emailed quote? Inquiry form that captures lead and Paolo replies manually?)
- Audience (public + indexed for SEO, or gated behind email capture?)
- Where it lives (likely `/catering-pricing-calculator`, but confirm)
**Once scoped:** standalone page with form + result. If lead-capture, integrate with whatever CRM/email system Paolo specifies. Likely a P1.

### B. Heard OS inventory product (the marketing-described "v1 zone-based inventory platform")
**What's needed from Paolo:** is the product described on `/heard-os`…
- (a) **already built** somewhere — separate repo? Subdomain? Just hidden?
- (b) **being built** — by whom, on what timeline?
- (c) **purely marketing** to gauge demand before committing to build?
**Once known:** if (a), document where it lives + how it links to the marketing page. If (b), add as a tracked ROADMAP item with milestones. If (c), update marketing copy to be honest about availability.

### C. Subdomains
**Status:** Paolo confirmed all subdomains (HSI etc.) are handled separately by him, not in scope for this repo. **No action needed in `hhgwebsite-next`.** Documented here only so a future agent doesn't try to absorb subdomain work into this repo without checking first.

---

## Tech debt (track but no urgency)

- **Mismatched dep versions** between this repo and what shadcn ships against. See P2 #6.
- **No analytics.** Vercel Analytics not enabled, no Plausible/PostHog/GA. Decisions about marketing are blind.
- **No error monitoring.** Server route exceptions land in Vercel function logs only — no Sentry, no alerting. A 500 streak on `/api/contractforge/generate` won't be noticed unless someone happens to look.
- **No automated tests.** No unit tests, no integration tests, no E2E. All current verification is manual / smoke-test via curl.
- **No CI gate.** GitHub pushes go straight to Vercel deploy. A bad commit will break production until reverted.
- **README is unmodified create-next-app boilerplate.** Should at minimum point at this file (`HANDOFF.md`).

---

## Process notes

- Every item completed → moved to `STATUS.md § Recent change history` with the commit SHA
- Every operation that touches runtime (deploy, env var, schema, model swap) → include rollback note in commit message pointing at `HANDOFF.md § Operational cheatsheet`
- New items added here → include the four sections (what, why, acceptance with checkboxes, rollback)
