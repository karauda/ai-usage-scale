# AI Usage Scale — design

**Date:** 2026-07-13 · **Status:** approved, implemented in v1.0.0-draft

## The problem

Every fight about AI and authorship runs through a label with two settings. That binary
collapses the expert who dictates thirty years of knowledge into a model, and the
unattended script that emits ten thousand pages overnight, into the same word.

The failure is not moral, it is arithmetic: **when honesty is punished and silence is
free, silence wins.** The research is unambiguous:

- **Disclosure paradox** (pre-registered, N=547): people call disclosure important, then
  penalise the disclosed work. The authors warn it "risks creating perverse incentives
  for non-disclosure."
- **The penalty runs through perceived effort, not quality.** Told a story was human,
  readers estimated 148 minutes of work; told it was AI, six. Labels moved *nothing*
  else — not creativity, not enjoyment, not originality. **A switch cannot communicate
  effort. A scale can.** This is the scientific justification for the whole project.
- **Implied truth effect** (Pennycook et al., *Management Science*): marking only the
  false makes the unmarked look verified. Fix: mark the true end too. **This makes
  Level 0 structurally necessary, not a courtesy.**
- Detection is not a backstop: AI detectors flagged 61% of genuine essays by non-native
  English speakers.

## The gap

~40 initiatives surveyed. Every mandatory regime (C2PA, SynthID, IPTC, EU AI Act Art. 50,
China, California) marks **the machine, not the human** — "did a model touch this",
never "how much of this is you". Every grassroots badge is binary and purity-coded.
Graded systems exist but are domain-locked (AIAS → education, HPF → film, DDEX → music)
or unlaunched (badgeai.org). **No general-purpose, graded, free, self-declared,
human-readable badge system has adoption.** The position is empty.

## Decisions

| Decision | Chosen | Rejected, and why |
|---|---|---|
| **What the scale measures** | The role AI played in the process: whose substance, who is accountable | *Proportion of AI output* — condemns the expert and the SEO farm identically, reproducing the bug in higher resolution. *Two axes (substance × form)* — correct but uncitable; standards win by being simple. |
| **Range** | **0–5**, six levels | *1–5* — leaves AI-refusers with nothing to wear, so they keep a rival badge and the standard loses half its base. Level 0 also fixes the implied-truth trap. |
| **Level 4 name** | **Prompted** | *Generated* — the stigmatised word ("AI-generated slop"). "Directed → Prompted" also reads as a clean gradient of what the *human* did. |
| **Composition** | One number on the badge; optional per-surface breakdown behind the link | *Composite code (T3·V5·A0)* — precise, unreadable in a byline, unquotable in speech. CC's three-layer model instead: mark → deed → spec. |
| **Enforcement** | Self-declaration. No registry, no verification, no fee | Detection (accuses the innocent), certification (adoption ceiling), cryptography (cannot see contribution). |
| **Interop** | Emit W3C `ai-disclosure` + IPTC + schema.org from day one | Competing = XKCD 927. We are the human-readable layer *above* the provenance plumbing. |
| **Site** | Astro → static HTML → Cloudflare Pages | *SPA* — the badge target `/3` must resolve in 2036, in a screen reader, a scraper, an LLM, archive.org, and with JS off. An SPA serves those an empty div. |
| **Licence** | CC0 marks + `levels.json`, CC BY 4.0 text, MIT code | Any paywall is an adoption ceiling. |
| **Name** | AI Usage Scale — `usagescale.org` + `.com` | Collision risk with AIAS (AI Assessment Scale) accepted: different field, different verb, and we cite them as prior art, turning collision into lineage. Both TLDs free — rare, and worth more over a decade than a cleverer single-TLD name. |

## The scale

Six levels, decided by five yes/no questions.

```
Was any generative AI used?                                  no  → 0  Human
Did AI produce new material that survived into the work,
  beyond mechanically processing what you already made?      no  → 1  Assisted
Did you make most of the final form yourself?                yes → 2  Co-created
Is the substance yours — knowledge, data, argument?          yes → 3  Directed
Did a human review it before publication?                    yes → 4  Prompted
                                                             no  → 5  Automated
```

**Governing principle: no level ranks above another.** Level 5 is honest for an
automated market report; Level 0 is honest for a memoir. A scale that ranks its own
levels is a shame ladder, and everyone lies their way down it. This is enforced in the
design: **all six marks are printed in one ink.** No green end, no red end.

Question 2 needed sharpening during design: naive phrasing ("did any AI output survive")
put a grammar-corrected sentence at Level 2, because a correction technically generates
new words. The rule is *new material*, not *processed material*.

## Architecture

`spec/levels.json` is the **single source of truth**. Badges, level pages, JSON-LD, alt
text, snippets and translations all generate from it.

```
/                 manifesto (15 theses, cited)
/0 … /5           level pages — the badge targets, must never break
/scale            all six at once
/find-your-level  5 questions → level + badge + sentence
/badges           the marks, CC0
/spec             decision procedure, edge cases, interop mappings
/sign             signatories
/levels.json      the source of truth, CC0
```

## Visual direction

The manifestos that *defined the internet* were not letterpress broadsides — they were
RFCs, Phrack text files, and unstyled HTML. Authority came from the absence of design.

**The typography carries the argument:** Spectral (serif) is the human voice — every
sentence a person is responsible for. IBM Plex Mono is the machine layer — navigation,
labels, levels, code, metadata, the badge. On every page you can see where the human is
and where the machine is. That is the one aesthetic risk taken; everything else stays
quiet.

Signature: the hero frame in which **two cells become six**. The outline never moves,
because we are not replacing the label — we are showing it was always too coarse.

Palette is deliberately *not* the AI-default warm-cream-and-terracotta: cool paper
(`#F0F2ED`), greenbar band (`#E4E9DF`), ledger-ink accent (`#0D4F45`). The accent is
never a warning colour, because there is nothing here to warn about.

## Notes for implementers

- **`opentype.js`'s `toPathData()` emits `NaN`** for some coordinates (its rounding helper
  does `Math.round(x + 'e+2')`). One `NaN` makes browsers abandon the path mid-glyph and
  the badge text silently truncates. We serialise the command list ourselves and the
  build asserts no non-finite value ever ships.
- **Badges are inline SVG by default.** A hotlinked badge is a tracking pixel on a
  stranger's page. A standard about honesty does not ship one.

## Open

- Translations (~20 languages) — pending sign-off. Each carries its own declaration
  under the translation rule; machine translations are marked as such.
- Domain purchase: `usagescale.org` + `.com` (~$25/yr).
- Level boundaries are explicitly open for challenge before 1.0 stable.
