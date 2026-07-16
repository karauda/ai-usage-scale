# Releasing the AI Usage Scale

This repository publishes a static site to Cloudflare Pages and creates immutable
GitHub release artifacts from version tags. Only the repository owner should merge
to `main` or create a release tag.

## 1. Create and publish the repository

```sh
git remote add origin git@github.com:karauda/ai-usage-scale.git
git add .
git commit -m "Prepare AI Usage Scale public draft"
git push -u origin main
```

If `origin` already exists, verify it with `git remote -v` instead of adding it.
Never force-push `main`.

Set the GitHub repository description to:

> A free, open scale for declaring how a work was made with generative AI.

Recommended topics: `ai`, `generative-ai`, `transparency`, `content-provenance`,
`open-standard`, `metadata`, `c2pa`, `iptc`, `ai-act`, `astro`.

Enable Issues, Discussions and the vulnerability-reporting form. Disable the wiki
unless somebody is committed to maintaining a second documentation surface.

## 2. Protect `main`

GitHub → repository **Settings** → **Rules** → **Rulesets** → **New branch ruleset**.

Create an active ruleset named `Protect main`, targeting the default branch, with:

- restrict deletions;
- block force pushes;
- require a pull request before merging;
- require the `Verify the standard` status check;
- require branches to be up to date before merging;
- require conversation resolution;
- require code-owner review;
- dismiss stale approvals when new commits are pushed;
- require linear history;
- do not grant bypass access to collaborators or GitHub Apps.

`CODEOWNERS` assigns the whole repository to `@karauda`. Do not grant Write or
Maintain access to contributors; they can contribute from branches or forks. On a
personal repository the owner retains administrative authority, so account security
is part of branch security: enable 2FA, prefer a passkey or security key, and keep
recovery codes offline.

Create a second active tag ruleset targeting `v*` that blocks deletion and force
updates. Release tags are public compatibility promises.

## 3. Configure Cloudflare Pages

Follow [DEPLOY.md](DEPLOY.md). In summary:

1. Create a Direct Upload Pages project named `usagescale`.
2. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub Actions
   repository secrets.
3. Give the token only `Account · Cloudflare Pages · Edit` for the relevant account.
4. Attach `usagescale.org`; redirect `www.usagescale.org` and `usagescale.ai` to the
   canonical HTTPS origin while preserving the path and query string.
5. Keep Cloudflare's build integration disabled: GitHub Actions uploads `dist/`.

Pull requests run CI but do not receive Cloudflare secrets and are not deployed.
Production deploys only after a commit reaches protected `main`, or after the owner
uses the manual `workflow_dispatch` action.

## 4. Pre-release checklist

```sh
npm ci
npm run verify
git status --short
```

Then verify manually:

- all factual sources and dates;
- `/`, `/scale`, `/find-your-level`, `/spec`, `/badges`, `/sign`;
- levels `/0` through `/5`;
- one LTR, one RTL and one CJK translation;
- `robots.txt`, `llms.txt`, `llms-full.txt`, `levels.json` and
  `/.well-known/ai-disclosure.json`;
- canonical URLs, redirects and the 404 response;
- mobile keyboard navigation and a screen-reader pass;
- that every non-English page shows its translation status.

## 5. Publish a release

Update `CHANGELOG.md`, remove `-draft` from the version only when the semantics are
actually stable, and commit the release preparation through a pull request.

```sh
git switch main
git pull --ff-only
npm ci
npm run verify
git tag -s v1.0.0 -m "AI Usage Scale v1.0.0"
git push origin v1.0.0
```

If signed tags are not configured yet, configure them before the public 1.0 rather
than silently creating an unsigned compatibility anchor. The tag triggers
`.github/workflows/release.yml`, which rebuilds the site and publishes the marks,
licensing information and `levels.json` as a GitHub Release asset.

For the first public publication, prefer `v1.0.0-beta.1` while translations and
field classification are still being reviewed.

## 6. Rollback

Do not rewrite a published tag. Revert the faulty commit through a pull request and
let `main` redeploy. If a release artifact is faulty, publish a new patch version.
If a level's meaning changes, follow the breaking-change policy in `GOVERNANCE.md`.
