# Changelog

All notable changes to the AI Usage Scale. The scale follows [semantic versioning](https://semver.org/):
a **major** bump means a level's meaning changed, and would invalidate declarations already
published. We will work very hard never to do that.

## [Unreleased]

### The scale

- **Boundary clarified: substance the model originated is new material.** The decision
  tree's second question said ideation that leaves no model-produced material in the work
  is Level 1, while Level 1's own excludes said AI restructuring your argument is not
  Level 1 — two honest people could reach different numbers. Resolved in the direction the
  levels always promised ("It invented nothing" has to mean it): a thesis, argument, or
  structure the model originated is new material that survives into the work, even if you
  wrote out every word yourself. That is Level 2 or above. Feedback, critique, and
  fact-finding you verify stay Level 1. New edge case: *Substance from AI, wording from
  you*. This resolves a contradiction rather than moving settled works between levels;
  under [governance](GOVERNANCE.md) it is a clarification, not a breaking change.
- The specification now documents the whole-site declaration at
  `/.well-known/ai-disclosure.json` — the discovery path for the Surfaces object.

### The marks

- New `auto` builds of every mark (`currentColor` ink): one inline snippet is legible on
  any host theme, light or dark. The inline snippets on the level pages now use them.
- New `name` chip variant that spells the level out — "AI USAGE ▮ 3 DIRECTED" — for
  audiences meeting the scale for the first time. The number-only chip stays the
  universal default. 54 SVGs now ship, up from 24.
- The hosted-embed snippet declared `width="205"` for a 122.5 px mark; dimensions are now
  read from the generated file and can no longer drift.

### New pages

- **/cases** — the case corpus the roadmap promised: real published works classified with
  the walk shown and sources linked. The Beatles' "Now and Then" at Level 0, *Zarya of the
  Dawn* at 3 with a Surfaces breakdown, The Guardian's GPT-3 essay and CNET Money at 4,
  the AP's automated earnings, Heliograf and Air Canada's chatbot at 5 — and Sports
  Illustrated's fake bylines as the undeclared anti-case.
- **/eu-ai-act** — Article 50 for publishers: the disclosure duty for AI-generated text
  from 2 August 2026, the human-review exemption, and how it lands on the Level 4 / 5
  distinction. Explicitly not legal advice; legal review remains on the roadmap.
- **Spec: "If you doubt a declaration"** — what a reader can actually do with a
  declaration they don't believe, in all 22 languages.
- The author signed `signatories.json`.

### The site

- The two lighter greys now clear WCAG AA for small text in both themes
  (light: ≈ 6.5:1 / 4.6:1; dark: ≈ 6.7:1 / 4.8:1).
- "Find your level" results were written to the URL as `#level-N` but never read back;
  a shared result link now opens on the result instead of question one.
- Signing no longer requires GitHub: the sign page links the contact page as an
  equal path in every language.

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
