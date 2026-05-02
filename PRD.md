# Heard Hospitality Group — Product Requirements Document

This document describes the **product intent** behind the website system at https://heardhospitalitygroup.com — what we're building, who it's for, why it exists. For technical orientation read `HANDOFF.md`. For current state read `STATUS.md`. For prioritized work read `ROADMAP.md`.

---

> ## ⚠️ READ THIS FIRST — INSTRUCTIONS FOR ANY LLM OPENING THIS FILE
>
> This document has **deliberate gaps** that only Paolo can fill. Do not invent answers, do not infer from training data, do not guess from context. Every gap below is marked `**[NEEDS PAOLO INPUT — Q#]**`.
>
> **If you are an LLM reading this as project context for any task:**
>
> 1. Read the "Open questions" list below.
> 2. If the user's task depends on any unanswered question, **surface that question to Paolo before proceeding**. Do not assume.
> 3. If a question is irrelevant to the current task, ignore it — but do not fill the gap with invention.
> 4. When Paolo answers a question, update both the "Open questions" list (mark it `✅ ANSWERED <date>`) and the inline marker in the body of this doc.
>
> The whole point of this file is to be a self-completing source of product truth. Don't break it.

---

## Open questions (Paolo to answer)

| # | Question | Why it matters | What unblocks |
|---|---|---|---|
| Q1 | **Brand portfolio.** The `/os` Supabase schema lists 9 brands: `HHG, LASA, Mels-Table, Revenue-Infrastructure, Heard-Kitchen, ContractForge, Heard-OS, BIB, Fit-Kitchen`. For each: one-sentence description + status (`active` / `pilot` / `dormant` / `shipped` / `aspirational`). | Section 3 of this PRD. Without this, any LLM helping with brand-related work will guess. | One-sentence answers per brand. |
| Q2 | **Primary conversion goal of the marketing site.** What's THE one action a visitor should take? (Submit contact form / book a call externally / phone / something else?) | Section 4a + Section 9 (success metrics). Drives every CTA decision. | One sentence. |
| Q3 | **AssessmentSection CTA.** The "Begin Infrastructure Review" button on `/` (id `#assessment`) currently does nothing — no `onClick`, no `href`. What should it do? (Scroll to ContactSection / open Calendly / open a modal / something else?) | Real bug. Anchor-link traffic from the nav lands here and bounces. | One sentence; fix is then a P1 task. |
| Q4 | **Contact form destination.** `ContactSection` POSTs to a hardcoded Make.com webhook (`hook.us2.make.com/5cvh24j98rp32txtb9vweps8ja4ps3o2`). What does that automation do downstream — email Paolo, drop into a CRM, both? Is the webhook URL a secret that should be moved to an env var? | Documenting the lead-capture pipeline + flagging if the webhook URL needs to be hidden. | Two sentences + a yes/no on env-var. |
| Q5 | **ContractForge monetization intent.** Currently free + public + no rate limit + Paolo pays per generation. Long-term: (a) free forever as marketing/lead-gen, (b) freemium, (c) gated/paid? | Section 4b + drives whether to prioritize rate limiting, auth, billing integration. | Pick one + any rough timeline. |
| Q6 | **ContractForge audience.** Currently anyone can use it. Intended audience: (a) only HHG's existing/prospective clients, (b) broader public hospitality operators, (c) general B2B (any small business)? | Section 4b + Section 5 (personas). Affects copy, distribution, abuse-prevention design. | Pick one. |
| Q7 | **Success metrics — quantitative targets or directional only?** For each surface (marketing, ContractForge, `/os`), do you have actual numeric targets (e.g. "20 leads/mo from organic", "50 ContractForge generations/mo") or just directional goals? | Section 9. With numbers we can build dashboards and make trade-off calls; without, every prioritization is vibes. | Numbers per surface, or "directional only — set targets later". |
| Q8 | **Company/strategic context** — any of the following you want documented: (a) HHG's revenue model (consulting fees only / mix of consulting + product), (b) team beyond Paolo + Mel (contractors? planned hires?), (c) strategic phase (validation / growth / profitability), (d) roadmap horizon (6-month / 1-year / 3-year). | Section 2 + Section 8 (in/out of scope). All optional but each makes the PRD sharper. | Whichever you want to share. Skip the rest. |

---

## Observations to verify (Paolo to confirm or correct)

These are facts I extracted from the codebase. Confirm each is current intent, or correct it.

- **Lead flow.** `ContactSection` is the only working contact form on the marketing site. It POSTs JSON `{name, business, monthlyRevenue, email, phone, interest, message}` to the Make.com webhook above. Errors are silently swallowed; the user always sees a "submitted" state regardless. **Verify:** is silent-on-error the desired UX, or should failures show an error?
- **AssessmentSection button is a dead-end.** No handler, no link. Probably meant to scroll to `#assessment` or `ContactSection`, or open a calendar booking. **See Q3.**
- **ContractForge currently runs on `claude-haiku-4-5`** (recently swapped from Sonnet 4.6 for cost). Verify this is the intended trade-off. If quality complaints surface, swap back to Sonnet via one-line edit (see `HANDOFF.md § Rollback: ContractForge broken`).
- **`/os` allowlist is exactly two emails:** `paolo@heardhospitalitygroup.com`, `chefmel@heardhospitalitygroup.com`. Verify this is the intended access scope.
- **`/heard-os` marketing page describes a "v1 zone-based inventory platform"** (FAQs reference Pro plan, Infrastructure plan, multi-user counting, CSV exports). Whether that product is built / being built / aspirational is a separate "Awaiting Paolo input" item in `ROADMAP.md`. **The marketing copy currently implies it exists.** If it doesn't, the copy may need to be hedged.
- **Subdomains.** Paolo confirmed all subdomains (HSI etc.) are handled separately and out of scope for this repo. This PRD describes only `heardhospitalitygroup.com` apex + `www`.

---

# Product Requirements

## 1. TL;DR

`heardhospitalitygroup.com` is the unified web presence + internal operating system for **Heard Hospitality Group (HHG)**, a Houston-based hospitality holding company. The site is a single Next.js 15 app that combines three distinct product surfaces: a **marketing site** (5 pages of services and product positioning), a **public AI tool** called ContractForge (`/contract-forge`), and a **private internal dashboard** called Heard OS (`/os`). All three share the same codebase, deploy pipeline, and brand system, but serve different audiences with different success criteria.

## 2. The company (HHG)

- **Name:** Heard Hospitality Group
- **Founder:** Paolo Nucum
- **Headquarters:** Houston, Texas
- **Mission (per `/about-heard-hospitality-group`):** "Help restaurants and hospitality businesses grow revenue using modern AI tools, automation systems, and digital infrastructure designed by operators."
- **Positioning (per Organization JSON-LD on `/`):** "AI-powered revenue infrastructure for restaurants, hospitality operators, and food businesses."
- **Core team (confirmed):** Paolo (founder); Mel (`chefmel@heardhospitalitygroup.com`, partner with `/os` access).
- **Revenue model:** **[NEEDS PAOLO INPUT — Q8a]**
- **Strategic phase:** **[NEEDS PAOLO INPUT — Q8c]**

## 3. The brand portfolio

HHG operates as a holding company with multiple brands. The `/os` Supabase `projects.brand` and `assets.brand` columns enforce these as the canonical 9-brand list. **Descriptions and statuses below need Paolo input** — do not invent.

| Brand | Description | Status |
|---|---|---|
| **HHG** | Parent company (this entity). | Active (parent) |
| **LASA** | **[NEEDS PAOLO INPUT — Q1]** | **[NEEDS PAOLO INPUT — Q1]** |
| **Mels-Table** | Mel-led brand. | **[NEEDS PAOLO INPUT — Q1: confirm description and status]** |
| **Revenue-Infrastructure** | **[NEEDS PAOLO INPUT — Q1: methodology name or operating brand?]** | **[NEEDS PAOLO INPUT — Q1]** |
| **Heard-Kitchen** | **[NEEDS PAOLO INPUT — Q1]** | **[NEEDS PAOLO INPUT — Q1]** |
| **ContractForge** | The AI contract generator product (this codebase, `/contract-forge`). | Active (live, free, public) |
| **Heard-OS** | The internal dashboard (this codebase, `/os`) AND the marketing-described inventory product. The two share a name — see Observations re: marketing copy. | Internal dashboard live; inventory product status TBD |
| **BIB** | **[NEEDS PAOLO INPUT — Q1]** | **[NEEDS PAOLO INPUT — Q1]** |
| **Fit-Kitchen** | **[NEEDS PAOLO INPUT — Q1]** | **[NEEDS PAOLO INPUT — Q1]** |

## 4. Product surfaces

### 4a. Marketing site — `heardhospitalitygroup.com` (apex + `/`, plus 5 service pages)

**Purpose:** Convert visitors into qualified consulting leads. Establish HHG as a credible authority in restaurant AI / revenue infrastructure. Be discoverable via traditional and AI-powered search.

**Audience:**
- Restaurant operators evaluating consulting services
- Hospitality businesses exploring AI/automation
- Search engines + AI search crawlers (Google, ChatGPT, Perplexity)
- **[NEEDS PAOLO INPUT — Q6: any others?]**

**Pages and intent:**

| Page | Intent |
|---|---|
| `/` | Hero + 4 anchor sections (Catering Revenue Architecture, AI Visibility Architecture, Retention Infrastructure, Operational Control Layer) + Heard OS preview + assessment + contact form |
| `/about-heard-hospitality-group` | Mission + industries served + credibility |
| `/ai-revenue-systems` | Service overview — 5 named systems + FAQPage schema |
| `/hospitality-ai-consulting` | Consulting service offerings |
| `/heard-os` | Marketing page for the Heard OS inventory product (FAQPage schema) |
| `/contract-forge` | Interactive ContractForge tool — see 4b |

**Primary conversion goal:** **[NEEDS PAOLO INPUT — Q2]**

**Lead capture (current):**
- `ContactSection` form on `/` posts to a Make.com webhook (see Observations)
- `info@heardhospitalitygroup.com` and `832-510-8440` published in footer
- `AssessmentSection` button is currently broken — see Q3

**Brand voice:** operator-to-operator, infrastructure-as-metaphor (no SaaS-speak, no marketing fluff). "Revenue infrastructure," "stability," "structure" are recurring frame words. Dark theme reinforces serious / industrial positioning.

**Success criteria:** **[NEEDS PAOLO INPUT — Q7]**

---

### 4b. ContractForge — `/contract-forge`

**Purpose:** Let any user generate a branded, professional contract draft from a structured form, using AI. Reduces the friction of contract-drafting from "engage a lawyer" to "fill out a form, edit the output."

**Current state:**
- Public, free, no auth, no rate limit
- Six contract types: Service Agreement, NDA, Catering & Events, Meal Prep & Delivery, Consulting, Partnership
- Inputs: brand config (logo, accent color, address, phone, email, license), Party A info, Party B info, terms (dates, fee, scope, clauses)
- Output: full HTML contract, rendered in browser, with the user's brand applied
- Backend: `/api/contractforge/generate` (Next.js API route) → `@anthropic-ai/sdk` → `claude-haiku-4-5` → HTML response
- Cost: ~$0.01–$0.03 per generation, paid by Paolo's Anthropic account
- Function timeout: 300s (Vercel Pro)

**Audience:** **[NEEDS PAOLO INPUT — Q6]**

**Monetization intent:** **[NEEDS PAOLO INPUT — Q5]**

**Success criteria:** **[NEEDS PAOLO INPUT — Q7]**

**Known limitations** (see `ROADMAP.md` for plans):
- No streaming → blank screen for 30–60s on long contracts
- Prompt built client-side → endpoint accepts arbitrary prompt → DOSable / abusable
- No rate limiting → Paolo's Anthropic credits are exposed to anyone with the URL
- Non-streaming output capped at 4000 tokens (~3000 words)

---

### 4c. Heard OS dashboard — `/os` (private, internal)

**Purpose:** Give Paolo and Mel a single place to coordinate operations across HHG's 9 brands — track active projects, manage tasks, and inventory sellable assets. Replace the implicit "it's in our heads / scattered across notes" model with a single source of truth.

**Audience:** Strictly Paolo + Mel. Email allowlist enforced. **[NEEDS PAOLO INPUT — Q8b: ever expanding to other team members?]**

**Core data model:**
- **Projects** — every initiative under HHG, scoped to one of the 9 brands, with status (active/pilot/dormant/shipped), owner (Paolo/Mel/Both), and revenue tier (producing/near-term/long-term)
- **Tasks** — actionable items, optionally linked to a project, assigned to Paolo or Mel, with due dates and 3-state status (open/doing/done)
- **Assets** — inventory of sellable things across the portfolio (products, services, content, templates, tools), with status (ready-to-sell/needs-work/dormant/sold) and optional Drive URL

**Key flows:**
1. Paolo or Mel signs in via magic link → lands on `/os` overview (counts + active projects + open tasks + sellable assets)
2. Creates / edits a project → links tasks to it → marks tasks done as work progresses
3. Adds new sellable asset → updates status as it moves through ready-to-sell → sold
4. Mobile usage by Mel is a first-class requirement (no horizontal scroll, large tap targets)

**Visual design:** White-on-black "nutrition label" aesthetic — bold horizontal rules instead of cards/shadows, mono numerics, weight-based status (no badges/pills), section headers in uppercase tracking-wider. Deliberately distinct from the marketing site's dark theme so the two contexts don't bleed into each other.

**Privacy posture (non-negotiable):** middleware-gated, robots Disallow, noindex metadata, no public links, allowlist enforced at TWO layers (callback route + app layout), Supabase RLS on all tables.

**Success criteria:** **[NEEDS PAOLO INPUT — Q7]**

## 5. Target users (personas)

**External — marketing site visitor:**
- Restaurant operator, ~$50K–$1M/mo revenue, searching for AI / automation / consulting
- Reads about page, services pages, evaluates Paolo/HHG as a fit
- Submits contact form OR phones / emails
- Conversion path: lands → reads → submits form → Paolo follows up → consulting engagement

**External — ContractForge user:**
- **[NEEDS PAOLO INPUT — Q6 will scope this]**

**Internal — Heard OS user:**
- Paolo: primary user, runs daily operations, expects desktop + mobile parity
- Mel: secondary user, partner, expects mobile-first experience (uses on phone in transit / in-kitchen)

## 6. Brand & design system

| Surface | Theme | Typography | Pattern language |
|---|---|---|---|
| Marketing | Dark (`bg-deep-gradient`, slate-derived) | System sans (Tailwind default) | Cards, shadows, gradient hero, infrastructure-beam patterns, blue accent |
| `/os` | Light (white bg, black text) | Inter + JetBrains Mono via `next/font/google`, scoped to `/os` | Bold horizontal rules, mono tabular numerics, no cards/badges/pills, weight-based status |
| ContractForge UI | Inherits marketing dark theme | Same as marketing | Same as marketing |

**Voice across all surfaces:** operator-to-operator. No "synergy," "platform," "ecosystem." Words like "infrastructure," "structure," "stability," "discipline." Specific over abstract. Numbers when possible.

## 7. Technical decisions & rationale

| Decision | Why |
|---|---|
| Next.js 15 App Router | SEO-critical marketing site benefits from server components + static rendering. App Router gives clean separation between marketing and `/os` via route groups + middleware. |
| `src/` layout | Standard scaffold; clean import alias (`@/*` → `./src/*`). |
| Supabase | Postgres + auth + RLS in one service; magic-link auth out of the box; free tier covers /os scale. |
| Vercel | Git-driven deploys; Edge network; Pro plan for 300s function timeouts (needed for ContractForge); same scope as Paolo's other projects. |
| `@anthropic-ai/sdk` (server-only) | Official SDK; key never exposed to browser; clean error types. |
| `claude-haiku-4-5` for ContractForge | ~3× cheaper, ~2× faster than Sonnet 4.6. Trade-off: less polished legal language. Acceptable for "draft I'll edit before sending." |
| Static page rendering for marketing | All marketing pages prerender at build → fast TTFB, cacheable, SEO-friendly. |
| No CMS | Marketing copy edits = code changes. Acceptable while team is 1–2 people; revisit if non-technical editing becomes a need. |

**Decisions deferred:**
- Analytics: none currently. Vercel Analytics, Plausible, PostHog, GA all candidates. **No decision yet.**
- Error monitoring: none currently. Sentry candidate. **No decision yet.**
- Tests: none currently. **No decision yet.**

## 8. In scope / Out of scope

**In scope for this repo:**
- The `heardhospitalitygroup.com` apex + `www` domain
- Marketing pages, ContractForge UI + API, Heard OS dashboard
- Lead-capture form integration via Make.com webhook
- Magic-link auth + email allowlist for `/os`
- Supabase tables: `projects`, `tasks`, `assets`

**Out of scope for this repo:**
- All subdomains (HSI etc.) — Paolo handles separately
- The Heard OS *inventory product* described on `/heard-os` marketing page (separate effort, location TBD — see `ROADMAP.md`)
- Catering pricing calculator (mentioned by Paolo, not yet scoped — see `ROADMAP.md`)
- Multi-tenant SaaS — `/os` is single-tenant for HHG only
- Non-technical content editing (no CMS)
- Native mobile apps
- Real-time collaboration in `/os`

## 9. Success metrics

**[NEEDS PAOLO INPUT — Q7 fills this section.]**

Default placeholders pending Paolo input:

| Surface | Directional goal | Quantitative target |
|---|---|---|
| Marketing | Generate qualified consulting leads | **TBD — Q7** |
| ContractForge | Drive usage as a lead-gen / brand asset | **TBD — Q7** |
| `/os` | Daily/weekly active use by both Paolo and Mel | **TBD — Q7** |

## 10. Open product questions (everything pending Paolo)

See top of doc — Q1 through Q8. Mirror here for grep-ability:

- [ ] **Q1** — Brand portfolio: describe + status for LASA, Mels-Table (confirm), Revenue-Infrastructure, Heard-Kitchen, BIB, Fit-Kitchen
- [ ] **Q2** — Marketing site primary conversion goal
- [ ] **Q3** — AssessmentSection CTA: what should the broken button do?
- [ ] **Q4** — Make.com webhook downstream + secret-status
- [ ] **Q5** — ContractForge monetization intent
- [ ] **Q6** — ContractForge audience scope
- [ ] **Q7** — Success metrics: numbers or directional?
- [ ] **Q8** — Company/strategic context (revenue model, team, phase, horizon — any subset)

When answered, mark `[x] **Q# ✅ ANSWERED <date>**` and update the corresponding inline `[NEEDS PAOLO INPUT — Q#]` in the body above with the answer.

---

## 11. Cross-references

- **Technical orientation, env vars, anti-patterns, rollback recipes:** `HANDOFF.md`
- **Current page-by-page state, SEO matrix, recent changes:** `STATUS.md`
- **Prioritized work, deferred items, tech debt:** `ROADMAP.md`
- **This file:** product intent + open product questions

The four files together are the complete project context. Any LLM picking up this codebase should read all four before making material changes.
