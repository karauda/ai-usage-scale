# Deploy

Static HTML on Cloudflare Pages. Push to protected `main` → live. Pull requests run the
complete CI suite but never receive deployment credentials.

## One-time setup

**1. Buy the domains** (~$25/yr total)

| | |
|---|---|
| `usagescale.org` | the standard's home — badge URLs point here, canonical everywhere |
| `usagescale.ai` | redirect to `.org` (301), holds the topical name and catches mistypes |

A `.org` is where every standard we are standing next to lives — `semver.org`, `schema.org`,
`creativecommons.org`, `contributor-covenant.org` — and that is not an accident. It is the
canonical home for exactly that reason: `.org` reads "neutral arbiter", not "AI startup".
The `.ai` only ever redirects here; nothing is served from it.

Note: `aiusagescale.org` and `aiusagescale.com` were registered out from under us within
hours of a first availability check — a textbook front-running grab. We renamed rather than
pay for them. The lesson is baked into this file: **decide the name, then register it the
same minute at your own registrar. Never check-and-wait.**

**2. Create the Cloudflare Pages project**

Cloudflare dashboard → Workers & Pages → Create → Pages → **Connect to Git** is *not* what
we want. Choose **Direct Upload** and name the project:

```
usagescale
```

GitHub Actions does the building, so Cloudflare only receives the finished `dist/`. This
matters: the build runs the badge generator and the test suite, and neither would run under
Cloudflare's own build system.

**3. Add two repository secrets**

GitHub → Settings → Secrets and variables → Actions:

| Secret | Where to get it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → Create → template **"Edit Cloudflare Workers"**, or a custom token with `Account · Cloudflare Pages · Edit` |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → right sidebar of any account page |

**4. Point the domain at the project**

Pages project → Custom domains → add `usagescale.org` and `www.usagescale.org`.
Then point `usagescale.ai` at the same project as a 301 redirect (Cloudflare → Rules →
Redirect Rules → 301 to `https://usagescale.org/$1`), so a badge that ever gets pasted as
`.ai` still resolves to the canonical `.org`.

## What happens on a push

```
push to main
  └─ CI: marks in sync with levels.json?  ← catches a definition changed without regenerating
     CI: 21 tests                          ← the decision tree, the mappings, the marks
     CI: typecheck, build
     CI: every level page carries the declaration in static HTML, with no JS
  └─ Deploy: wrangler pages deploy dist → usagescale.org

open a PR
  └─ same checks, no deployment credentials, no production write
```

## Clean URLs

Astro is set to `build.format: 'file'`, so `/3` builds to `3.html`. Cloudflare Pages serves
that at **`/3`** — no extension, no trailing slash. That is the badge target and it must
stay short: it will sit in other people's articles for years.

## Caching

`public/_headers` marks `/badge/*` and `/fonts/*` immutable for a year. The badge files are
content-addressed by level, and a level's *meaning* never changes within a major version —
so if a mark's appearance is ever revised, ship it under a new path rather than mutating
one people have already cached.

## Releasing a version

```sh
git tag v1.0.0 && git push --tags
```

Builds, tests, and publishes a GitHub release with the marks and `levels.json` zipped and
attached — so anyone can mirror the standard without depending on this server staying up.

**A major version bump means a level's meaning changed.** That silently invalidates every
badge already published against the old definition. Treat it as near-impossible.

For the complete repository, branch-protection and release procedure, see
[`RELEASING.md`](RELEASING.md).
