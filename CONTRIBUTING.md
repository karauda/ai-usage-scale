# Contributing

The most useful thing you can bring here is **a case the scale gets wrong.**

## Challenge a level boundary

If you can describe a real piece of work where the decision tree gives an answer that
feels false, that is a bug in the standard and it matters more than any code. Open an
issue with:

1. What you actually did, in a sentence.
2. The level the tree gives you.
3. The level you believe is right, and why.

Boundary disputes settle in `spec/levels.json` and in the **Edge cases** section of the
spec. Every edge case currently listed there arrived exactly this way.

## Change a definition

`spec/levels.json` is the source of truth for the English level semantics, mappings and
decision tree. It drives badges and machine-readable output. Localised explanatory copy
is maintained separately, so a semantic English change requires an explicit translation
sync and review-status update. Run `npm run verify` before opening a pull request.

**A change to what a level *means* is a breaking change.** Declarations are already
published against these definitions; if we redefine Level 3 under people's feet, every
badge already on the web starts lying. Expect that bar to be high.

## Translate it

The scale is worth nothing if it only works in English, and the translations are where
we most need people. Each one carries its own declaration under the
[translation rule](https://usagescale.org/spec#translation) — machine translations are
marked as machine translations, and a human reviewer who signs off replaces that mark
with their own name.

Open an issue saying which language you want, so two people do not do the same one. Follow
[`docs/TRANSLATION-POLICY.md`](docs/TRANSLATION-POLICY.md), compare the complete rendered
translation with the English source, and record your name, review date and source commit.

Machine output may improve access but does not qualify as human review. Do not change
`MT` to `HR` or `CV` unless the documented review requirements were met.

## Code

```sh
npm install
npm run badges   # regenerate the 54 SVGs
npm run dev
npm run build
```

Two rules the badge generator will not bend on:

- **All six marks use one ink.** No colour gradient from "good" to "bad". A scale that
  colours its own extremes has already told you which one to be ashamed of.
- **No badge fetches anything.** Type is outlined, not set; nothing is hotlinked. If a
  change makes a badge phone home, it will be rejected.

## Sign

Add yourself to `signatories.json` by pull request. Signing commits you to one thing:
declare the level on what you publish. It does not commit you to agreeing with the
manifesto — several signatories do not.

## Other ways to help

See [`SUPPORT.md`](SUPPORT.md) for adoption, integration, review and outreach work. For a
larger change, open an issue before implementation so effort is not duplicated.
