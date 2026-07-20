# Changelog

All notable changes to the AI Usage Scale. The scale follows [semantic versioning](https://semver.org/):
a **major** bump means a level's meaning changed, and would invalidate declarations already
published. We will work very hard never to do that.

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
