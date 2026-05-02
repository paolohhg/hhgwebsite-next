# Handoff — hhgwebsite-next

**Audience:** future Claude Code sessions opening this repo + chat-side LLMs writing prompts to send here. This file is the orientation. Read it before doing anything.

For current state of every page/feature, read `STATUS.md`. For prioritized next work, read `ROADMAP.md`.

---

## Critical context (read first)

- **Active repo:** `C:\Users\paolo\hhgwebsite-next\` (Next.js 15, App Router, `src/` layout). GitHub: `paolohhg/hhgwebsite-next`, branch `main` = production.
- **Old repo (deleted):** `C:\Users\paolo\hhgwebsite\` (Vite SPA, GitHub `paolohhg/stability-grid-pro`). Local contents emptied; the empty shell folder may still be on disk pending manual `Remove-Item`. GitHub repo deletion is still pending (handled via web UI).
- **Live site:** https://heardhospitalitygroup.com — served from this repo via Vercel (project `paolo-1494s-projects/hhgwebsite-next`). Auto-deploys on push to `main`.
- **Owner:** Paolo Nucum (`paolo@heardhospitalitygroup.com`). Partner with `/os` access: Mel (`chefmel@heardhospitalitygroup.com`).

---

## Repo essentials

```
Tech:        Next.js 15 (App Router), TypeScript, Tailwind 3, shadcn/ui
Layout:      src/ — alias @/* resolves to ./src/*
Node:        24.x (Vercel runtime)
Package mgr: npm (with --legacy-peer-deps; see Anti-patterns)
```

**Local dev:**
```bash
cd C:/Users/paolo/hhgwebsite-next
npm install --legacy-peer-deps        # never plain `npm install` — see Anti-patterns
npm run dev                            # http://localhost:3000
npm run build                          # production build
npx tsc --noEmit                       # typecheck only
```

**Deploy:** `git push origin main` triggers Vercel auto-deploy. No manual `vercel deploy` needed.

---

## Architecture

Three product surfaces in one Next.js app:

| Surface | URL pattern | What it is |
|---|---|---|
| Marketing site | `/`, `/about-…`, `/ai-revenue-systems`, `/hospitality-ai-consulting`, `/heard-os` | Public-facing HHG marketing pages. Dark theme. |
| ContractForge | `/contract-forge` (UI) + `/api/contractforge/generate` (server route) | Public AI-powered contract generator. Calls Anthropic via server proxy. |
| Heard OS dashboard | `/os/*` | Private internal dashboard for Paolo + Mel. Magic-link auth, email allowlist, Supabase backend, white/black nutrition-label aesthetic. Middleware-gated, noindex, robots Disallow. |

All three coexist under the same Next.js app. Marketing pages use the dark `bg-deep-gradient` theme; `/os` lives in its own light-theme world via `src/app/os/layout.tsx`.

---

## Hosting & infrastructure

| Thing | Value | Notes |
|---|---|---|
| Vercel project | `paolo-1494s-projects/hhgwebsite-next` | Pro plan. CLI: `vercel link` from repo root targets it. |
| Custom domain | `heardhospitalitygroup.com` + `www.heardhospitalitygroup.com` | Both attached. |
| DNS | GoDaddy | `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`. Vercel recommends migrating to `216.150.1.1` / `vercel-dns-016.com` but old records still work. |
| Function timeout | 300s on `/api/contractforge/generate` | Default elsewhere. Pro plan ceiling. |
| Build | npm install + `next build`. `.npmrc` at repo root sets `legacy-peer-deps=true` so Vercel install succeeds. | |

---

## Environment variables

All four below must be set in **Vercel → hhgwebsite-next → Settings → Environment Variables → Production** AND in local `.env.local` for dev.

| Name | Purpose | Where to source value | What breaks if missing |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase dashboard → Settings → API → Project URL | `/os` middleware throws on every request |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key (RLS-bound) | Supabase dashboard → Settings → API → "anon public" | Same — `/os` 500s |
| `ALLOWED_EMAILS` | Comma-separated email allowlist for `/os` sign-in | Manually edited; currently `paolo@heardhospitalitygroup.com,chefmel@heardhospitalitygroup.com` | Allowlist enforcement fails-open to "deny all" — nobody can sign in |
| `ANTHROPIC_API_KEY` | Server-side key for ContractForge | `console.anthropic.com` → Settings → API Keys | `/api/contractforge/generate` returns 500 with explicit error |

**Never** put `NEXT_PUBLIC_` on `ANTHROPIC_API_KEY` — that prefix exposes the var to the browser bundle. The current var is correctly server-only.

**Local `.env.local` is gitignored** (via `.env*` rule). Real values live there but never in the repo. Keep this file populated for local dev; it does not propagate to Vercel automatically.

**Rotation procedure** (any env var):
1. Generate new value at the source (Supabase / Anthropic / etc.)
2. Update `.env.local` locally
3. `vercel env rm <NAME> production` then `echo "<value>" | vercel env add <NAME> production` (value never echoed to chat)
4. Trigger redeploy: `git commit --allow-empty -m "redeploy: rotate <NAME>" && git push`
5. Revoke old value at the source

---

## Anti-patterns (concrete things not to do)

Recorded from real mistakes made in this repo's history. A future agent that violates these will repeat known failures.

1. **Do not `npm install` without `--legacy-peer-deps`.** The repo has a known pre-existing peer-dep conflict (`react-day-picker@8` requires `date-fns@^2 || ^3`, but `date-fns@4` is installed). Vercel handles this via the committed `.npmrc`; local installs need the flag explicitly until a proper fix lands (see `ROADMAP.md`).

2. **Do not write code in `C:\Users\paolo\hhgwebsite\`.** That's the deleted legacy Vite repo. Some folder shell may still exist on disk. The active repo is `hhgwebsite-next`.

3. **Do not call `https://api.anthropic.com/v1/messages` directly from client code.** It both leaks the API key into the browser bundle and is blocked by CORS. Always proxy through a Next.js API route (see `src/app/api/contractforge/generate/route.ts` for the pattern).

4. **Do not embed secrets in chat output, commits, or comments.** API keys, anon keys, tokens. Pipe values via stdin to `vercel env add` instead of echoing. The Supabase anon key is technically client-safe (RLS-bound) but treat all env values as confidential by default.

5. **Do not link to `/os` from any public page.** Robots disallow, noindex, no public links — three layers of "this isn't discoverable." Don't break that.

6. **Do not add `/os` routes to `sitemap.ts`** (`src/app/sitemap.ts`). The sitemap is the marketing surface only.

7. **Do not use `yes |` to pipe into `vercel projects rm`.** The CLI hangs because `yes` never closes stdin. Use `echo y | vercel projects rm <name>`. Note `--yes` and `--non-interactive` flags exist but don't actually skip the confirm prompt in current CLI versions.

8. **Do not force-push to `main`.** Use `git revert <sha>` to back out a bad commit. Force-push will detach Vercel deploy history.

9. **Do not change `model:` in `/api/contractforge/generate/route.ts` to a non-existent or date-suffixed model ID.** Use exact IDs from the `claude-api` skill: `claude-opus-4-7`, `claude-sonnet-4-6`, `claude-haiku-4-5`. Currently `claude-haiku-4-5` for cost/speed; swap to Sonnet if quality matters.

10. **Do not change the Supabase magic-link redirect URL** in Supabase dashboard without coordinating: it must include both `https://heardhospitalitygroup.com/os/auth/callback` and `http://localhost:3000/os/auth/callback`. Removing either breaks sign-in for that environment.

---

## Operational cheatsheet

### Vercel CLI (most-used)

```bash
vercel link --project hhgwebsite-next --yes   # link cwd to project
vercel ls hhgwebsite-next                      # list recent deployments
vercel inspect <deploy-url>                    # deploy details
vercel inspect --logs <deploy-url>             # full build/runtime logs
vercel env ls                                  # env var registry (names only)
echo "<value>" | vercel env add <NAME> production    # add env var without echoing
vercel env rm <NAME> production                # remove env var
vercel rollback <previous-deploy-url>          # revert prod to a prior deploy
vercel domains add <domain>                    # attach domain to linked project
```

### Rollback recipes

Each is a checkbox list. Run top-to-bottom; verify each step.

#### Rollback: bad production deploy
- [ ] `vercel ls hhgwebsite-next` — note current production deploy URL (top of list)
- [ ] Note the previous Ready Production deploy URL (next in list with `Ready` + `Production`)
- [ ] `vercel rollback <previous-deploy-url>` — promotes that deploy to production
- [ ] `curl -sI https://heardhospitalitygroup.com/` — verify response is HTTP 200
- [ ] Hard-refresh in browser → confirm bug is gone
- [ ] Open `git log --oneline -5` and decide: revert the bad commit or push a fix

#### Rollback: env var change
- [ ] Identify the var name and the previous value (must be known — Vercel doesn't store history)
- [ ] `vercel env rm <NAME> production` — accept prompt with `y`
- [ ] `echo "<previous-value>" | vercel env add <NAME> production`
- [ ] Trigger redeploy: `git commit --allow-empty -m "redeploy: revert <NAME>" && git push`
- [ ] Verify: hit the affected route and confirm previous behavior restored

#### Rollback: git commit on main
- [ ] `git revert <bad-sha> --no-edit` — creates inverse commit
- [ ] `git push origin main` — triggers Vercel deploy of the reverted state
- [ ] Wait ~30–60s for build to complete: `vercel ls hhgwebsite-next | head -3`
- [ ] Verify on heardhospitalitygroup.com (or hhgwebsite-next.vercel.app)

#### Rollback: domain detached from project
- [ ] `vercel link --project hhgwebsite-next --yes` (if not linked)
- [ ] `vercel domains add heardhospitalitygroup.com`
- [ ] `vercel domains add www.heardhospitalitygroup.com`
- [ ] `vercel domains inspect heardhospitalitygroup.com` — confirm "Projects" section lists `hhgwebsite-next`
- [ ] DNS already points correctly at GoDaddy; should re-verify within minutes

#### Rollback: ContractForge broken (model swap, prompt change, route refactor)
- [ ] `git log --oneline -- src/app/api/contractforge/generate/route.ts src/components/contractforge/ContractForgeApp.tsx | head -5`
- [ ] Identify last-known-good commit
- [ ] `git revert <bad-sha> --no-edit && git push`
- [ ] Smoke test: `curl -s -X POST https://heardhospitalitygroup.com/api/contractforge/generate -H "Content-Type: application/json" -d '{"prompt":"test"}' | head -c 200`
- [ ] Should return JSON `{"html":"…"}`

#### Rollback: Supabase schema migration
- [ ] **Pre-condition:** every forward migration must have a paired reverse SQL written before applying. If reverse SQL doesn't exist, this rollback is impossible — restore from Supabase backup instead.
- [ ] Open Supabase dashboard → SQL Editor → New query
- [ ] Paste reverse SQL → Run
- [ ] Verify table state matches pre-migration: `select * from <table> limit 1`
- [ ] If app code referenced new columns, also revert the corresponding code commit

### Common diagnostic recipes

```bash
# Check what's serving the production domain right now
curl -sI https://heardhospitalitygroup.com/ | grep -iE "(x-vercel|age|cache)"

# Smoke test the ContractForge API end-to-end
curl -s -X POST https://heardhospitalitygroup.com/api/contractforge/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Generate one HTML paragraph: test."}'

# Verify Supabase RLS is blocking unauthenticated reads (should return [])
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/projects?select=*" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

---

## Document index

- `STATUS.md` — current state of every page, every feature, every integration. Update this whenever the live state changes.
- `ROADMAP.md` — prioritized list of what's next. Items move out of here when done; rollback recipes for non-trivial changes get added to this file (cheatsheet section above) when relevant.
- `HANDOFF.md` (this file) — orientation. Update when the architecture/process changes, not for routine state changes.

When making a change that touches the runtime (deploy, env var, schema, model), include a one-line "Rollback:" note in your commit message pointing at the recipe above (e.g. `Rollback: see HANDOFF.md § Rollback: ContractForge broken`).
