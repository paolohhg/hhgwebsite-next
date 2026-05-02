# Status — hhgwebsite-next

Snapshot of "what's live right now." Update this file whenever runtime state changes.

**Last updated:** 2026-05-02 (post SEO sitemap pass, commit `fe8fadb`)
**Live URL:** https://heardhospitalitygroup.com
**Production deploy:** see `vercel ls hhgwebsite-next | head -3`

---

## Live at a glance

| Surface | Status | Notes |
|---|---|---|
| Marketing site | ✅ Live | All 6 pages serving. SEO baseline in place; per-page OG metadata + OG image still pending (see `ROADMAP.md`). |
| ContractForge | ✅ Live | Model: `claude-haiku-4-5`. End-to-end smoke-tested. |
| Heard OS dashboard (`/os`) | ⚠️ Live but unverified | Code deployed, env vars set, schema applied. Mel has not signed in / validated yet. |
| Hosting | ✅ Vercel `hhgwebsite-next` | Custom domain attached, DNS resolving. |
| Old repo cleanup | ⚠️ Partially done | Local emptied, Vercel projects deleted. GitHub repo `paolohhg/stability-grid-pro` still exists — pending manual delete via web UI. |

---

## Marketing site

### Routes

All static-rendered (`○ (Static)` in build output). No dynamic routes.

| Route | File | Status |
|---|---|---|
| `/` | `src/app/page.tsx` | ✅ Live. Includes Organization JSON-LD. |
| `/about-heard-hospitality-group` | `src/app/about-heard-hospitality-group/page.tsx` | ✅ Live |
| `/ai-revenue-systems` | `src/app/ai-revenue-systems/page.tsx` | ✅ Live. Includes FAQPage JSON-LD. |
| `/hospitality-ai-consulting` | `src/app/hospitality-ai-consulting/page.tsx` | ✅ Live |
| `/heard-os` | `src/app/heard-os/page.tsx` | ✅ Live. Includes FAQPage JSON-LD. **Marketing page only — describes a "v1 zone-based inventory platform" whose actual build status is awaiting Paolo input.** |
| `/contract-forge` | `src/app/contract-forge/page.tsx` | ✅ Live (interactive — see ContractForge section below) |

### SEO matrix

| Route | Title | Desc | Canonical | OG override | Twitter override | JSON-LD | In sitemap |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `/` | ✅ template | ✅ | ✅ | inherits root only | inherits root only | ✅ Organization | ✅ |
| `/about-heard-hospitality-group` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| `/ai-revenue-systems` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ FAQPage | ✅ |
| `/hospitality-ai-consulting` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| `/heard-os` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ FAQPage | ✅ |
| `/contract-forge` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |

### Sitemap

Source: `src/app/sitemap.ts` (dynamic). Served at `/sitemap.xml`. Robots.txt at `public/robots.txt` references it. Adding a new marketing route requires editing `sitemap.ts` to include it.

`/os/*` routes are intentionally excluded (also blocked via `Disallow: /os/` in robots and `noindex` in `src/app/os/layout.tsx`).

### Components (custom, non-shadcn)

| File | Used by |
|---|---|
| `src/components/StickyNav.tsx` | All marketing pages. Contains `productItems` (Heard OS, ContractForge), `infraModules`, and `navLinks`. |
| `src/components/Footer.tsx` | All marketing pages |
| `src/components/HeroSection.tsx` | `/` |
| `src/components/InfraStatusSection.tsx` | `/` |
| `src/components/InstabilitySection.tsx` | `/` |
| `src/components/StackSection.tsx` | `/` |
| `src/components/PlatformArchitectureSection.tsx` | `/` |
| `src/components/MachineSection.tsx` | `/` |
| `src/components/AnchorSection.tsx` | `/` (rendered for each of `#catering`, `#ai-search`, `#reactivation`, `#ops-automation`) |
| `src/components/HeardOSPreview.tsx` | `/` |
| `src/components/AssessmentSection.tsx` | `/` |
| `src/components/ContactSection.tsx` | `/` |
| `src/components/ConsultingCTA.tsx` | `/hospitality-ai-consulting` |
| `src/components/heardos/*` | `/heard-os` |
| `src/components/contractforge/ContractForgeApp.tsx` | `/contract-forge` (interactive client component) |
| `src/components/providers/query-provider.tsx` | Root layout |
| `src/components/providers/hash-scroll-handler.tsx` | `/` |

### Theme

Dark theme via CSS variables in `src/app/globals.css`. Tailwind config maps semantic tokens (`bg-background`, `text-foreground`, `bg-card`, etc.) to HSL vars. Custom utility classes for hero effects: `.bg-deep-gradient`, `.infra-pattern`, `.infra-beams`, `.hero-glow`, `.hero-depth`, `.hero-atmosphere`.

---

## ContractForge

| Item | Value |
|---|---|
| UI page | `src/app/contract-forge/page.tsx` |
| Client component | `src/components/contractforge/ContractForgeApp.tsx` |
| Server route | `src/app/api/contractforge/generate/route.ts` (POST) |
| Model | `claude-haiku-4-5` |
| `max_tokens` | 4000 |
| Function timeout | 300s (`maxDuration = 300`) |
| Streaming | No — non-streaming response |
| Auth | None — public endpoint |
| Rate limiting | None |
| Cost (rough) | ~$0.01–$0.03 per generation on Haiku 4.5 |
| Required env | `ANTHROPIC_API_KEY` (server-side only) |

**Architecture:** browser → POST `/api/contractforge/generate` with `{prompt}` → server route holds API key, calls Anthropic via `@anthropic-ai/sdk`, returns `{html}`. Client strips ```` ```html ```` fences and renders.

**Known smoke test:** `curl -s -X POST https://heardhospitalitygroup.com/api/contractforge/generate -H "Content-Type: application/json" -d '{"prompt":"Generate one HTML paragraph: test."}'` → returns `{"html":"…"}`.

---

## Heard OS dashboard (`/os`)

| Item | Value |
|---|---|
| Auth | Magic link via Supabase `signInWithOtp` |
| Allowlist | `ALLOWED_EMAILS` env var, comma-separated. Currently `paolo@heardhospitalitygroup.com,chefmel@heardhospitalitygroup.com`. |
| Allowlist enforcement | Two layers: `/os/auth/callback` route (signs out + redirects on mismatch) AND `(app)/layout.tsx` (defense-in-depth re-check) |
| Middleware | `src/middleware.ts` matches `/os/:path*`, redirects unauth'd to `/os/login` |
| Privacy | (1) `Disallow: /os/` in `public/robots.txt`, (2) `robots: { index: false, follow: false, nocache: true }` on `src/app/os/layout.tsx`, (3) zero links from public pages, (4) excluded from `sitemap.ts` |
| Theme | White/black nutrition-label aesthetic — overrides marketing dark theme inside the `/os` layout. Inter + JetBrains Mono via `next/font/google` (scoped). |
| Database | Supabase project `qzsvzwilefxmltogdnym.supabase.co` |
| Tables | `projects`, `tasks`, `assets` — RLS enabled, `auth read/write` policies for `authenticated` role only |

### Routes

| Route | File | Purpose |
|---|---|---|
| `/os` | `src/app/os/(app)/page.tsx` | Overview: stat tiles, active projects, open tasks, sellable assets |
| `/os/login` | `src/app/os/login/page.tsx` | Magic-link form. Silently no-ops for non-allowlisted emails (anti-enumeration). |
| `/os/auth/callback` | `src/app/os/auth/callback/route.ts` | OAuth callback. Exchanges code → session, then re-checks allowlist. Mismatch → `signOut` + redirect to login with error. |
| `/os/projects` | `src/app/os/(app)/projects/page.tsx` | Projects list grouped by status. Inline create form. |
| `/os/projects/[id]` | `src/app/os/(app)/projects/[id]/page.tsx` | Project detail + edit + delete + linked tasks |
| `/os/tasks` | `src/app/os/(app)/tasks/page.tsx` | Tasks split into Doing / Open / Done(last 25). Status toggle + delete per row. |
| `/os/assets` | `src/app/os/(app)/assets/page.tsx` | Assets grouped by status. Status select per row (only client-JS in /os, via `status-select.tsx`). |

### Data model (Supabase)

```sql
projects(id, name, description, brand, status, revenue_tier, owner, next_action, notes, created_at, updated_at)
  brand: HHG | LASA | Mels-Table | Revenue-Infrastructure | Heard-Kitchen | ContractForge | Heard-OS | BIB | Fit-Kitchen
  status: active | pilot | dormant | shipped
  revenue_tier: producing | near-term | long-term (nullable)
  owner: Paolo | Mel | Both

tasks(id, project_id→projects, title, assignee, due_date, status, notes, created_at, completed_at)
  assignee: Paolo | Mel
  status: open | doing | done

assets(id, name, category, brand, status, drive_url, notes, created_at)
  category: product | service | content | template | tool
  status: ready-to-sell | needs-work | dormant | sold
```

Row Level Security is enabled on all three tables. Policies grant SELECT/ALL to the `authenticated` Supabase role only — anonymous requests get empty arrays. The email allowlist is enforced in app code (callback + layout), not at the database level (any authenticated user could in principle query, but auth itself is gated by allowlist).

### Adding a new allowlisted user

1. Update `ALLOWED_EMAILS` env var locally and in Vercel: append `,newemail@domain.com`.
2. Trigger redeploy: `git commit --allow-empty -m "redeploy: add <name> to /os allowlist" && git push`.
3. New user requests magic link at `/os/login`. They're now authorized.

---

## Hosting status

| Item | Value |
|---|---|
| Vercel project | `paolo-1494s-projects/hhgwebsite-next` (Pro plan) |
| Production URL | `https://hhgwebsite-next.vercel.app` (alias) |
| Custom domain | `heardhospitalitygroup.com` + `www.heardhospitalitygroup.com` (both attached, DNS valid) |
| GitHub remote | `https://github.com/paolohhg/hhgwebsite-next.git` (main = production) |
| Auto-deploy | On push to `main`. Preview deploys on PRs. |
| Deleted projects | `hhgwebsite-next-asg3` (duplicate, removed), `stability-grid-pro` (legacy Vite, removed) |

---

## Outstanding cleanup

| Item | Action | Priority |
|---|---|---|
| Empty `C:\Users\paolo\hhgwebsite\` shell | Delete via File Explorer or `Remove-Item C:\Users\paolo\hhgwebsite -Force` from a fresh terminal (current Claude Code session may hold the cwd) | Low |
| GitHub repo `paolohhg/stability-grid-pro` | Delete via https://github.com/paolohhg/stability-grid-pro/settings → Danger Zone (no `gh` CLI installed) | Low |
| Lovable subscription | User said don't worry about; not actioning | — |

---

## Recent change history (most recent first)

| Commit | Summary |
|---|---|
| `fe8fadb` | SEO: dynamic sitemap, add canonicals to /contract-forge and /heard-os |
| `d1d794c` | ContractForge: swap Sonnet 4.6 → Haiku 4.5 |
| `abae81a` | ContractForge: raise function timeout to 300s, cap output at 4000 tokens |
| `1b14361` | Fix ContractForge: proxy Anthropic call through server route |
| `ef60fa7` | Restore nav cleanup: Products = Heard OS + ContractForge |
| `b0519c5` | Add /os private dashboard and unblock production deploys |
| `c1e1003` | Initial Next.js migration from Vite SPA |

For the full file-level history of a given route or component, use `git log --oneline -- <path>`.
