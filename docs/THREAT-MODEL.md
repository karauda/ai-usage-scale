# Misuse & threat model

A self-declaration standard has no enforcement and no detector — by design. Its integrity rests
on the same footing as a byline, a nutrition label, or a conflict-of-interest statement: **cheap
to make, expensive to break.** This document names the ways that footing can be attacked, what the
design already does about each, and — honestly — what it does *not* try to solve.

`SECURITY.md` covers how to report a vulnerability; `docs/PRIVACY.md` covers what the site collects
(nothing). This covers how the declaration itself can be abused.

## A — Dishonest declarations

**A1. Under-claiming** (declaring a lower level than the truth). *A Level 4 blog network declares
Level 1 to look more "human-made."* The declaration is a public, accountable claim by the party
responsible for the work; like a false byline, it carries reputational and, in regulated contexts,
legal exposure when exposed. The Sports Illustrated anti-case in the corpus is exactly this failure
and its cost. **Not solved, deliberately:** the standard will never detect a lie — one that needed
a detector would recreate the false-accusation machine the manifesto rejects.

**A2. Over-claiming** (declaring Level 5 to dodge accountability). *"The AI did it, don't blame
us."* The Air Canada case is the answer: a declaration describes the *process*, it never transfers
*accountability*. Level 5 means "no human read this first," not "no human answers for it."

**A3. The decorative / surfaces dodge** (AI wrote the substance; declarer calls it "decorative" and
headlines Level 0). The headline rule, Surfaces, and the "Substance from AI, wording from you" edge
case are built for exactly this: substance the model originated is new material that drives the
headline.

## B — Coercion (the serious one)

**B1. An employer, platform, or client forces a declaration.** *"Label all freelance work Level 4
so we can pay less," or "everything ships as Level 0."* Two design choices reduce the *incentive*:
no level ranks above another (so there is no "better" number to coerce someone toward), and the
declaration is made by whoever holds editorial responsibility (tying the number to accountability,
not to labour). **Not solved:** the scale is a vocabulary, not a labour protection. It cannot stop
an employer's policy any more than a nutrition label can stop a food company. This is the most
important limitation to state plainly — the non-hierarchy is a mitigation, not a guarantee.

## C — Weaponising absence or presence

**C1. "No badge = AI slop"** (third parties treating absence as proof of dishonest AI use). The
manifesto answers this structurally: the scale starts at 0, so human work has a number too — the
same remedy the implied-truth research found (verify the true ones, not only the false). The
residual risk shrinks as Level 0 becomes common.

**C2. Compliance-washing** (*"We're EU AI Act compliant — we use Level 4."*). The `/eu-ai-act` page
already disclaims this repeatedly; the metadata is labelled experimental; the project never claims
"compliant/approved." Keep that discipline.

## D — Vocabulary & artifact integrity

**D1. Semantic translation drift** (a level means something different in one language). CI enforces
structural shape, placeholder integrity, and thesis/source counts, and every translation declares
itself machine-made. **Not fully solved by machines:** prose *meaning* can drift even when
structure holds — which is why named native-language reviewers are the human check the tests
cannot replace.

**D2. Badge forgery / misapplication** (a Level 0 badge on Level 5 work). A badge is a
self-declaration, not a certificate (`SECURITY.md`). Badges are inline SVG with no central issuance
— there is nothing to forge, because the image was never the authority. The accountable claim is.

**D3. Site / supply-chain integrity.** Covered by `SECURITY.md`'s reporting scope: static-only
build, no runtime external fetch (guarded by `check:dist`), a locked-down Content-Security-Policy,
and marks that carry no external reference.

**D4. Privacy / tracking.** No analytics, no cookies, no hotlinked badges (a hotlinked badge *is* a
tracking pixel and is refused), signing is a pull request. See `docs/PRIVACY.md`.

## Summary

| Defended against | By |
|---|---|
| Tracking of declarers | No registry, no phone-home, inline SVG |
| Accountability-dodging via "Level 5" | Process ≠ accountability |
| Coercion toward a "better" number | No level ranks above another |
| Compliance-washing | Explicit disclaimers + experimental labels |
| False accusation of humans | Starts at 0; declaration, not detection |

| Not claimed to solve | Honest framing |
|---|---|
| A determined liar's false declaration | Not a detector, by design |
| An employer's coercive labelling policy | A vocabulary, not a labour protection |
| Semantic translation drift | Needs named native reviewers |
| Third-party misuse of "no badge" | Shrinks with adoption; starts-at-0 is the structural answer |

The scale makes honesty cheap and legible. It cannot make dishonesty impossible — and a standard
that claimed to would be lying.
