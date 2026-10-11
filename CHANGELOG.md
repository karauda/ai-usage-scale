# Changelog

All notable changes to the AI Usage Scale. The scale follows [semantic versioning](https://semver.org/):
a **major** bump means a level's meaning changed, and would invalidate declarations already
published. We will work very hard never to do that.

## [1.3.1] — 2026-10-11

- Rebuild seven reference views around one document layout: aligned headings and reading columns, a sticky desktop contents list and native collapsible mobile navigation.
- Replace the wide decision table with readable question steps; stack mapping fields on mobile and keep short inline code terms together. Add labelled, copyable specification examples.
- Keep English reference blocks and code readable inside RTL pages; align gallery and example spacing with the shared layout.
- Condense project status into scope, evidence, standards discussion and review records. Review status and classification criteria are unchanged.

## [1.3.0] — 2026-10-11

This website and tooling revision preserves the v1.2.0 classification criteria and decision branches.

- Replace the manifesto homepage with a typographic reference: six definitions, a practical declaration flow and explicit project status, in all 22 locales.
- Retire the maintainer-only signature list and redirect its URLs to project information. Retain the original English manifesto in the historical archive.
- Remove assumed Level 3 website metadata and unsupported human-approval statements. Record pending editorial and translation review.
- Correct JSON-LD to use an explicit project extension. Add vocabulary validation and declaration consistency checks.
- Update CG mapping candidates to the 9 October 2026 text vocabulary. Levels 1 and 2 now return `null` for `w3cAiDisclosure` because scope/review must be assessed separately; generic snippets no longer infer a CG declaration from the numeric level.
- Replace unreliable classifications of third-party works with illustrative workflows. Distinguish public references from verified adoption.
- Correct policy explanations, privacy statements, licensing scope, citation metadata and MCP installation instructions.
- Remove the editorial Level 5 claim that disclosure makes a work legitimate, in every language; retain its classification criteria.
- Flag the unresolved Level 3 review shortcut in the wizard, MCP responses and specification documentation.
- Upgrade dependencies, pin Actions to commits, expand deployment/release gates, configure dependency updates and add browser/accessibility checks.
- Record the GitHub audit and prepare concrete use cases for standards discussion. Public submissions are tracked separately from adoption or institutional acceptance.

The MCP package is version 1.3.0 and is attached as an installable archive; this release does not publish it to npm. The vocabulary archive includes both JSON Schemas and all 54 SVG marks. Human editorial and fluent translation review remain pending.

Historical release notes below describe earlier revisions. Their legal, adoption and interoperability claims are superseded by the current documentation where corrected.

## [1.2.0] — 2026-08-09

The law caught up, so the mapping did too. **The scale is unchanged** — same six levels, same
definitions, same decision tree — so no declaration already published is affected. A minor
version, by the policy above.

- **Every level now carries its EU mapping.** `levels.json` gains `euAiActIcon` and a note per
  level, mapping the scale onto the three EU icons published with the Code of Practice: Level 2
  is an exact match for *Partially AI-Modified*, Levels 4 and 5 for *Fully AI-Generated*, and
  Levels 0 and 1 need no icon at all. **Level 3 is marked as contested rather than guessed** —
  its substance is human and its form is not, so neither EU term is true of it, and the basic
  icon plus its interactive second layer is the honest mark.
- **`interop` gains three legal regimes** beside W3C, IPTC and C2PA: the EU AI Act with its icons
  and Code of Practice, China's labelling Measures with GB 45438-2025, and the California AI
  Transparency Act (SB 942 as amended by AB 853). All three ask the same three questions — was AI
  involved, how much of the work is its own, and did a human take responsibility.
- **A correction on the EU AI Act page.** It read as though human review switched the disclosure
  duty off generally. It does not: the Article 50(4) exemption is written for **text only**, so a
  reviewed, signed-off deepfake still carries the duty. That is now stated where the mistake was.
- **Source code is outside Article 50.** The Commission's final Guidelines (20 July 2026) exclude
  it broadly — code comments, SDKs, SQL, infrastructure-as-code, YAML and JSON configuration,
  schemas, scripts, APIs and libraries — along with short outputs and machine-to-machine output.
  The page says so plainly: the code surface of a declaration is not a legal artifact, and this
  standard never claimed the law asked for one.
- **The page is current.** Article 50 has applied since 2 August 2026, the Code of Practice was
  confirmed adequate in July 2026, and the remaining deadlines — 2 December 2026 for marking on
  systems already on the market, February 2027 for watermark interoperability — are named.
- **242 corrections across all 21 translated locales.** Each locale was audited against English
  for wording that would send a reader to a *different level*: a dropped negation, "most" softened
  to "some", "review" collapsed into "edit". Polish had narrowed "the expert" to "the surgeon" and
  rendered Level 5's "legitimate" as "legal"; Ukrainian, Russian and Turkish carried comparable
  slips. Key parity and interpolation placeholders are unchanged, and both are gate-tested.
- **A wider document.** Prose keeps a readable measure while tables, marks and snippets now span
  the full page, so a three-column mapping table is no longer squeezed into a prose column.
  Section headings open on a rule, level tables gained hairline rows and a header, and a wide
  table scrolls inside its own box instead of pushing the page sideways. No horizontal overflow
  at 320px.

## [1.1.1] — 2026-07-22

Site hardening, accessibility, and documentation. **The scale is unchanged** — same six
levels, same definitions, same decision tree — so no declaration already published is
affected. A patch, by the policy in GOVERNANCE.md.

- **The English-only reference pages now declare English.** `ecosystem`, `integrations`,
  `cases` and `eu-ai-act` are served under every locale but keep English bodies. They were
  emitting `<html lang="pl">` and hreflang for translations that do not exist; they now
  declare `lang="en"`, canonicalise to their English URL, and drop the false alternates —
  fixing a WCAG language mismatch and 84 duplicate URLs.
- **A strict Content-Security-Policy.** The site ships `default-src 'self'`,
  `connect-src 'none'`, hashed scripts and styles, plus `X-Frame-Options` and a
  `Permissions-Policy` — the "nothing phones home" promise, now proven at the browser level.
  A build gate fails if the inline theme script's hash ever drifts out of sync.
- **New docs:** a [threat model](docs/THREAT-MODEL.md) — how a self-declaration can be
  misused, and what the design does and does not defend — and a [FAQ](docs/FAQ.md).

## [1.1.0] — 2026-07-20

A boundary clarification, two new reference pages, and a larger badge family. No level
changed its meaning; under the policy in GOVERNANCE.md this is a **minor** version.

- **Boundary clarified: substance the model originated is new material.** The decision
  tree's second question said ideation that leaves no model-produced material in the work
  is Level 1, while Level 1's own excludes said AI restructuring your argument is not
  Level 1 — two honest people could reach different numbers. Resolved in the direction
  the levels always promised ("It invented nothing" has to mean it): a thesis, argument,
  or structure the model originated is new material that survives into the work, even if
  you wrote out every word yourself. That is Level 2 or above; feedback, critique, and
  fact-finding you verify stay Level 1. New edge case: **Substance from AI, wording from
  you**. This resolves a contradiction rather than moving settled works between levels —
  a clarification, not a breaking change. Updated in all 22 languages.
- **New page: the case corpus (`/cases`)** — real published works classified, with the
  walk to the number shown and sources linked: The Beatles' "Now and Then" at Level 0,
  Zarya of the Dawn at 3 with a Surfaces breakdown, The Guardian's GPT-3 essay and CNET
  Money at 4, the AP's automated earnings, Heliograf and Air Canada's chatbot at 5, and
  Sports Illustrated's fake bylines as the undeclared anti-case.
- **New page: EU AI Act (`/eu-ai-act`)** — Article 50 for publishers: the disclosure
  duty for AI-generated text from 2 August 2026, the human-review exemption, and how it
  lands on the Level 4 / Level 5 distinction. Explicitly not legal advice; legal review
  remains on the roadmap.
- **Spec: "If you doubt a declaration"** — what a reader can do with a declaration they
  don't believe, in all 22 languages. The spec also documents the whole-site declaration
  at `/.well-known/ai-disclosure.json`, the discovery path for the Surfaces object.
- **Marks: `auto` builds and a named chip.** Every mark now ships in a `currentColor`
  build, so one inline snippet is legible on any host theme; the level pages' inline
  snippets use them. A new chip variant spells the level out — "AI USAGE 3 DIRECTED" —
  for audiences meeting the scale for the first time; the number-only chip stays the
  universal default. 54 SVGs, up from 24.
- **Fixed:** the hosted-embed snippet declared `width="205"` for a 122.5 px mark —
  dimensions are now read from the generated file; the two lighter text greys now clear
  WCAG AA for small text in both themes; a shared "Find your level" result link
  (`#level-N`) now opens on the result instead of question one.
- Signing no longer requires GitHub: the sign page links the contact page as an equal
  path in every language. The author signed `signatories.json`.
- **The draft has an end date.** The level boundaries stay open for challenge through
  **31 December 2026**; the first stable release, without the `-draft` suffix, follows
  once the roadmap's Toward-1.0 gates close. Details in the roadmap.

## [1.0.0-draft] — 2026-07-13

Initial draft. **Not yet stable — the level boundaries are open for challenge.**

- Six levels, 0–5, decided by five yes/no questions.
- Levels named: Human, Assisted, Co-created, Directed, Prompted, Automated.
- Optional per-surface declaration (text, image, audio, video, code, data).
- Edge cases settled: translation, transcription, decorative assets, derivative works,
  live generation, non-generative machine learning.
- Mappings onto W3C `ai-disclosure`, IPTC Digital Source Type, and schema.org.
- Badge family: 6 levels × chip/stamp × light/dark, type outlined, CC0.
- Published in **22 languages**, with a switcher. Every translation declares itself as a
  machine translation on the page, under the scale's own translation rule.
- Social cards, schema.org `DefinedTermSet` (the levels as a controlled vocabulary),
  reciprocal hreflang, `llms.txt` and `llms-full.txt` (the whole standard in one fetch).
