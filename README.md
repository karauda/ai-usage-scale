<div align="center">

# The AI Usage Scale

**An open standard for declaring how a work was made — whose knowledge it carries, and who stands behind it.**

Six levels. Free. CC0. No account, no fee, no committee.

[usagescale.org](https://usagescale.org) · [The manifesto](https://usagescale.org) · [Find your level](https://usagescale.org/find-your-level) · [Specification](https://usagescale.org/spec) · [`levels.json`](https://usagescale.org/levels.json)

</div>

---

> **There is no shameful level. There is only an undeclared one.**

"Made with AI" is one checkbox for everything from a spell-check to an unattended content farm. It tells readers nothing, and it punishes the people honest enough to tick it. The **AI Usage Scale** replaces that binary with **six levels, 0–5**, that a creator self-declares in thirty seconds and links to a public definition. It records *what the model did, whose substance the work carries, and whether a human reviewed it before publication* — not how many words a model emitted. No account, no detector, no registry, no fee. It is [CC0](LICENSES.md), it interoperates with IPTC, C2PA and the W3C disclosure work, and it ships in 22 languages.

<sub>An open standard for **AI disclosure** and **AI content transparency** — a **generative-AI usage label** and **AI attribution / content-provenance** vocabulary for **disclosing AI use** in text, images, audio, video and code. A human-vs-AI **authorship scale**, CC0 and interoperable with **C2PA**, **IPTC Digital Source Type** and the **W3C AI Content Disclosure** work.</sub>

---

## The problem this exists for

Every fight about AI and authorship currently runs through a label with two settings.

That label puts the surgeon who dictated thirty years of practice into a model and corrected every line, and the script that emitted ten thousand pages last night while its owner slept, into the same three words. It cannot tell them apart, so it tells you nothing — and the people it punishes hardest are the ones who were honest enough to tick the box.

This is measurable, and it has a name. In a pre-registered study, people said disclosure of AI use was important — and then rated the disclosed work lower. The authors' own words: this *"risks creating perverse incentives for non-disclosure."* Meanwhile TikTok now lets viewers choose **how much** AI they see, and Pinterest lets them ask for less.

**The audience already has a dial. The creator still has only a switch.**

## The scale

| | | |
|---|---|---|
| **0** | **Human** | No generative AI was used. |
| **1** | **Assisted** | AI worked only on material you had already made. It invented nothing. |
| **2** | **Co-created** | You made most of the final form. AI made parts of it that stayed. |
| **3** | **Directed** | The substance is yours. AI produced the form. |
| **4** | **Prompted** | AI produced the substance and the form. You asked, you checked, you are accountable. |
| **5** | **Automated** | AI produced the substance and the form. No human read it before it was published. |

Five yes/no questions decide it:

```
Was any generative AI used?                                  no  → 0
Did AI produce new material that survived into the work
  (beyond mechanically processing what you already made)?    no  → 1
Did you make most of the final form yourself?                yes → 2
Is the substance yours — knowledge, data, argument?          yes → 3
Did a human review it before publication?                    yes → 4   no → 5
```

**No level ranks above another.** Level 5 is the honest answer for an automated market report; Level 0 is the honest answer for a memoir. A scale that ranks its own levels is a shame ladder, and everyone lies their way down it. The only dishonest level is an undeclared one.

## Use it

Copy the inline SVG from any level page. It is self-contained: no external font, no external file, **no request back to us**. A hotlinked badge is a tracking pixel on your page, and a standard whose subject is honesty has no business shipping one.

```html
<a href="https://usagescale.org/3" rel="ai-disclosure"
   title="The knowledge, data and argument are the author's; AI produced the text from them.">
  <svg …><!-- 5 KB, self-contained --></svg>
</a>
```

Where an image cannot go — a search-result description, a bio, an email signature:

```
AI Usage Scale: Level 3 (Directed) — usagescale.org/3
```

And for machines:

```html
<!-- AI Usage Scale proposal; custom metadata, not a registered standard -->
<meta name="ai-usage" content="3">
<meta name="ai-usage-standard" content="https://usagescale.org">

<!-- Experimental W3C Community Group alignment; not a W3C standard -->
<meta name="ai-disclosure" content="ai-generated">
<link rel="ai-disclosure" href="https://usagescale.org/3">
```

These fields describe how the work was made. They do not grant or deny training rights;
licences, terms and access controls remain authoritative.

## We are not another standard to compete with

The [W3C AI Content Disclosure Community Group](https://www.w3.org/groups/cg/ai-content-disclosure/) is discussing syntax for four broad disclosure states, but it has not published a W3C standard. The `ai-disclosure` metadata above is therefore experimental. Every level also maps to an established [IPTC Digital Source Type](https://cv.iptc.org/newscodes/digitalsourcetype/), which can travel in IPTC metadata and C2PA manifests.

The mapping is lossy in exactly one direction, and that loss is the entire point:

> **IPTC cannot tell Levels 3, 4 and 5 apart.** It has no term for *whose substance this is*, and none for *whether a person read it*. Those are the two questions readers actually care about.

C2PA provides signed, tamper-evident provenance for an asset. Its core specification does not attribute content to individuals or organisations; anyone can implement it, while participation in its official trust model requires conformance and trusted signing credentials. **Provenance can be proven. Contribution can only be declared.** So can a byline. So can a nutrition label. Civilisation runs on claims that are cheap to make and expensive to break.

## 22 languages, and every translation says what it is

The standard is published in 22 languages: العربية (`ar`), বাংলা (`bn`), Deutsch (`de`), English (`en`), Español (`es`), فارسی (`fa`), Français (`fr`), हिन्दी (`hi`), Bahasa Indonesia (`id`), Italiano (`it`), 日本語 (`ja`), 한국어 (`ko`), Nederlands (`nl`), Polski (`pl`), Português (`pt`), Русский (`ru`), Svenska (`sv`), ไทย (`th`), Türkçe (`tr`), Українська (`uk`), Tiếng Việt (`vi`), 简体中文 (`zh`).

Every translation other than English is machine-produced — and **each one says so on the page**, in the reader's language, above the fold. That is not a disclaimer. It is the scale's own [translation rule](https://usagescale.org/spec#translation) applied to the scale: *a faithful translation inherits the level of the source work and adds a translation note.*

Twenty-one silent machine translations of a transparency standard would have discredited it on day one. An honest one costs nothing and proves the thing works.

The **mark** does not translate. "AI USAGE 3" is the standard's name the way "CC BY" is Creative Commons' — the number is the universal code. What travels with it in every language is the definition, the sentence you paste, and the text a screen reader speaks.

## This repository declares its own level

**Level 3 — Directed.** The diagnosis, the argument, and every design decision in the scale are the author's. The research and the prose were produced with a large language model, then read, corrected, and signed line by line.

That is exactly the case this standard defends. Hiding it would have been absurd.

## Develop

```sh
npm install
npm run badges   # regenerate the 24 SVGs from spec/levels.json
npm run dev
npm run build    # static HTML → dist/, deploy anywhere
```

`spec/levels.json` is the source of truth for the English definitions, mappings and decision tree. Badges and machine-readable output are generated from it. Localised explanatory copy is maintained separately and tested for structural parity; changing English still requires an explicit translation update.

The badge generator outlines its type rather than setting it, so a badge renders identically on a site that has never heard of IBM Plex Mono. It also asserts that no coordinate is `NaN` — `opentype.js`'s own serialiser emits them, and a single one makes browsers abandon the path mid-glyph, silently truncating the text.

## Licences

| | |
|---|---|
| Marks, `levels.json`, the scale itself | **CC0-1.0** — no attribution, no permission, no friction |
| Manifesto and specification text | **CC BY 4.0** |
| Site code | **MIT** |

Every paywall is an adoption ceiling. There isn't one.

## Contributing

The scale will be wrong in places. [Fix it](CONTRIBUTING.md) — especially the edge cases, and especially the translations. Disagreement about where a level's boundary sits is the most useful thing you can bring.

To sign the manifesto, add yourself to [`signatories.json`](signatories.json).

See the [translation policy](docs/TRANSLATION-POLICY.md) before submitting a language,
[governance](GOVERNANCE.md) for how decisions are made and what a breaking change means, and
the [roadmap](docs/ROADMAP.md) for where this is going. See also the
[security policy](SECURITY.md), the [code of conduct](CODE_OF_CONDUCT.md), and
[ways to support the project](SUPPORT.md).
