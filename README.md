# AI Usage Scale

An independent, open vocabulary for declaring how generative AI contributed to a work and whether a person reviewed it before publication.

[Website](https://usagescale.org) · [Definitions](https://usagescale.org/scale) · [Find your level](https://usagescale.org/find-your-level) · [Specification](https://usagescale.org/spec) · [Project status](https://usagescale.org/project)

The scale describes a process. A number is a publisher’s self-declaration, not a quality score, authorship certificate, detector result or legal compliance assessment. An absent declaration means the process is unknown.

## Six levels

| Level | Name | Description |
|---|---|---|
| 0 | Human | No generative AI was used. |
| 1 | Assisted | AI supported research or mechanically processed human material; no new model-originated material remains. |
| 2 | Co-created | The human made most of the final form; AI-created parts remain. |
| 3 | Directed | Original human substance materially determines the work; AI supplies most of the form, with meaningful human review. |
| 4 | Prompted | AI supplies substance and form; a human meaningfully reviews the work before publication. |
| 5 | Automated | AI supplies substance and form; no human reviews the output before publication. |

Read the [complete definitions](spec/levels.json) and edge cases before declaring a level. Text, image, audio, video, code and data may have different levels; an optional surfaces object records those differences.

**Known boundary:** the current decision tree can suggest Level 3 before checking human review, although the definition requires it. That suggestion needs verification against the definition. Resolving the unreviewed, human-substance case requires an explicit specification decision; this revision preserves the existing level meanings.

## Use a declaration

Choose a definition and link to it. For example, for a work that satisfies Level 3:

```text
AI Usage Scale: Level 3 (Directed) — https://usagescale.org/3
```

Each [level page](https://usagescale.org/3) includes disclosure sentences and self-contained SVG marks. Downloaded or inline marks need no request to this website. Hosted badge URLs remain available; loading them sends a request to the hosting provider.

Optional project metadata:

```html
<meta name="ai-usage" content="3">
<meta name="ai-usage-standard" content="https://usagescale.org">
<link rel="ai-disclosure" href="https://usagescale.org/3">
```

These names are project conventions. For JSON-LD, identify the extension explicitly:

```json
{
  "@context": {
    "@vocab": "https://schema.org/",
    "aiUsageLevel": "https://usagescale.org/spec#aiUsageLevel"
  },
  "@type": "CreativeWork",
  "aiUsageLevel": 3
}
```

`aiUsageLevel` is not a registered Schema.org property. The vocabulary itself uses the existing `DefinedTermSet` and `DefinedTerm` types. Neither representation creates a dedicated Google Search feature.

A declaration grants no training permission. Licensing, consent, terms and access controls are separate questions.

## Status and evidence

The published vocabulary is version **1.3.0**. English is the normative source. Core pages are available in **22 languages**; the 21 translations are labelled as machine translations pending fluent human review. Some developer and policy references remain in English.

As of **10 October 2026**, two CHAOSS repositories reference the project in related-tools lists. A diarie backlog records deferred interest. This audit verified no independent, public production declaration; references and interest are not deployments or endorsements. See [the evidence](docs/ADOPTERS.md).

This is an independent proposal. Suggested IPTC mappings, experimental W3C Community Group metadata and C2PA comparisons do not imply acceptance by those organisations. [Schema.org issue #3391](https://github.com/schemaorg/schemaorg/issues/3391) is a relevant public discussion; a [submission draft](docs/STANDARDS-SUBMISSION.md) is prepared for review.

The current website revision was produced with AI assistance and awaits human editorial review. It does not automatically declare its own content to be Level 3.

## Machine-readable files

| Endpoint | Purpose |
|---|---|
| [levels.json](https://usagescale.org/levels.json) | Definitions, questions, edge cases and suggested mappings; localised copies at `/<lang>/levels.json`. |
| [spec.schema.json](https://usagescale.org/spec.schema.json) | JSON Schema for the vocabulary document. |
| [levels.schema.json](https://usagescale.org/levels.schema.json) | JSON Schema for a declaration. |
| [llms.txt](https://usagescale.org/llms.txt) / [llms-full.txt](https://usagescale.org/llms-full.txt) | Optional plain-text references for tools. |
| [feed.xml](https://usagescale.org/feed.xml) | Published release history. |

`spec/levels.json` is the canonical source. Pin a [release](https://github.com/karauda/ai-usage-scale/releases) when reproducing a declaration. The schemas validate structure and consistency, not the truth of a publisher’s claim.

The repository includes a [local MCP server](mcp/README.md). **The package is not currently published on npm**; install it from source or the archive attached to [release v1.3.0](https://github.com/karauda/ai-usage-scale/releases/tag/v1.3.0). It exposes classification, level lookup and the full vocabulary over stdio.

## Development

Requires Node.js **22.12 or later**; Node.js 24 is also supported.

```sh
npm ci
npm run dev
npm run verify
```

`verify` checks Astro types, builds the static site and generated assets, then validates the vocabulary, translations, classifier, schemas and shipped HTML.

For browser checks:

```sh
npx playwright install chromium
npm run test:browser
```

The browser script serves `dist/` locally and checks layout, keyboard operation, the wizard, themes and accessibility. With an existing Chrome installation, use `BROWSER_CHANNEL=chrome npm run test:browser`.

The site is static Astro, with local fonts, a light/dark theme and Arabic/Persian directionality. All six definitions and the decision procedure remain readable without JavaScript. CI verifies pull requests; production deployment uses Cloudflare Pages.

## Contribute and licence

Useful contributions include a documented workflow that exposes a boundary, an independent integration, or a translation reviewed against the English source. See [Contributing](CONTRIBUTING.md), [Governance](GOVERNANCE.md) and [Roadmap](docs/ROADMAP.md).

Maintained by [Konrad Karauda](https://github.com/karauda). Decisions and changes are recorded in public issues and pull requests.

- Scale definitions and SVG marks: **CC0-1.0**.
- Website explanatory prose and documentation: **CC BY 4.0**.
- Website and MCP code: **MIT**.
- IBM Plex Mono and Spectral fonts: **SIL Open Font License 1.1**, with notices in `src/fonts/`.

See [LICENSES.md](LICENSES.md) for scope and [CITATION.cff](CITATION.cff) for citation metadata. The original manifesto is retained as a [historical document](docs/history/manifesto-2026-07.md); it is no longer the homepage.
