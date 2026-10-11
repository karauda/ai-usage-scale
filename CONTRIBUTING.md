# Contributing

Useful contributions include a documented classification boundary, a working integration or a translation reviewed against English.

## Challenge a boundary

Open an issue with the workflow, the decision-tree result, the relevant definition and why the result appears inconsistent. Include primary evidence if the example describes a real publication.

The known Level 3 review gap needs an explicit specification decision. Do not quietly change a branch or definition to make a single example fit.

## Change the vocabulary

`spec/levels.json` is canonical. Localised definitions are maintained separately. A change assigning an existing workflow to a different level is a breaking semantic change; record it in the changelog and review translations.

Metadata and editorial corrections are distinct from level semantics. Proposed standards relationships must state their actual status.

## Develop

Requires Node.js 22.12 or later.

```sh
npm ci
npm run dev
npm run verify
npx playwright install chromium
npm run test:browser
```

If changing MCP behaviour, also run:

```sh
npm ci --prefix mcp
npm run test:server --prefix mcp
npm run sync --prefix mcp
npm pack --dry-run --prefix mcp
```

Generated marks must stay self-contained and use the same ink across all six levels. Run `npm run badges` when their source changes. Avoid analytics, external runtime resources and false source-level declarations.

## Translate

Follow [the translation policy](docs/TRANSLATION-POLICY.md). Record a named fluent reviewer, source commit and scope before marking content as reviewed. Model output does not satisfy that requirement.

## Document a public use

Add verified declarations to [the evidence record](docs/ADOPTERS.md), with a public example and date checked. A reference, star or signature is not a deployment.

Run the relevant checks before opening a pull request. Describe what changed, whether semantics changed, and what was actually tested.
