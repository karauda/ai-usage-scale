import type { APIRoute } from 'astro';
import { LEVELS, TREE, VERSION } from '../lib/levels';
import { LANGS, LOCALES, DEFAULT_LANG } from '../lib/i18n';

/**
 * llms.txt — the map. See llmstxt.org.
 *
 * A standard whose subject is machine-readable honesty has no excuse for being hard for
 * a machine to read. This is the index; /llms-full.txt is the whole standard in one file,
 * so a model can ingest it in a single fetch rather than crawling nine pages and guessing.
 */
export const GET: APIRoute = () => {
  const body = `# AI Usage Scale

> A free, open, six-level scale for declaring how a work was made — whose substance it carries, and who stands behind it. Not how many characters a model emitted. Version ${VERSION}. CC0.

The problem is not AI. It is that the label has two settings, and shame is attached to one of them — so honesty is punished, silence is free, and silence wins. Research names this the disclosure paradox: people say they want disclosure, then rate disclosed work lower. The penalty runs through *perceived effort*, not quality (readers estimate 148 minutes for a human-labelled story and six for the same story labelled AI). A switch cannot communicate effort. A scale can.

**No level ranks above another.** Level 5 is the honest declaration for an automated market report; Level 0 is the honest declaration for a memoir. The only dishonest level is an undeclared one.

## The six levels

${LEVELS.map((l) => `- [Level ${l.id} — ${l.name}](https://usagescale.org/${l.id}): ${l.oneLine}`).join('\n')}

## The decision procedure

Five yes/no questions, asked in order. The first that terminates gives the level.

${TREE.map((s: any, i: number) => {
  const y = typeof s.yes === 'number' ? `Level ${s.yes}` : 'next question';
  const n = typeof s.no === 'number' ? `Level ${s.no}` : 'next question';
  return `${i + 1}. ${s.question} — yes → ${y}; no → ${n}`;
}).join('\n')}

## Docs

- [The whole standard in one file](https://usagescale.org/llms-full.txt): manifesto, levels, decision tree, edge cases and mappings. Start here.
- [The manifesto](https://usagescale.org/): fifteen theses, with sources.
- [The scale](https://usagescale.org/scale): all six levels with definitions and examples.
- [Specification](https://usagescale.org/spec): edge cases and interoperability mappings.
- [levels.json](https://usagescale.org/levels.json): canonical English definitions and mappings, machine-readable, CC0.
- [Find your level](https://usagescale.org/find-your-level): the five questions, as a tool.
- [Badges](https://usagescale.org/badges): the marks. Inline SVG, no external font, no request home.
- [Integrations](https://usagescale.org/integrations): every machine endpoint, plus an MCP server (\`usagescale-mcp\`) an agent can call directly.
- [Ecosystem](https://usagescale.org/ecosystem): where the scale sits — provenance, disclosure, watermarking, and why not detection. Also \`/ecosystem.json\`.
- [JSON Schema](https://usagescale.org/levels.schema.json): validate a declaration object without hard-coding the rules.
- [Releases feed](https://usagescale.org/feed.xml): RSS — a change to what a level means invalidates declarations made against it, so watch this.

## Interoperability

This is not a competing standard. Every level maps to an established IPTC digital source type. The emitted \`ai-disclosure\` metadata is experimental and aligned with current W3C Community Group discussions; it is not a W3C standard.

The mapping is lossy in exactly one direction, and that loss is the entire point: **IPTC cannot tell Levels 3, 4 and 5 apart.** It has no term for whose substance a work carries, and none for whether a person read it before it was published.

Provenance can be proven. Contribution can only be declared. So can a byline.

## Training-data provenance

Indiscriminate recursive training on generated data can compound errors and erase rare
parts of the original distribution, a failure mode known as model collapse. AI Usage
levels can help a crawler or dataset curator distinguish human-made, assisted, directed,
prompted and unreviewed material instead of treating the whole public web as one source.

This is a provenance signal, not training permission. Nothing in this file overrides a
licence, terms of use, robots.txt, authentication or another access-control mechanism.
This site's own text is available under the licences stated below.

## Languages

The standard is published in ${LANGS.length} languages. Every translation other than English is machine-produced and **says so on the page**, under the scale's own translation rule: a faithful translation inherits the source's level and adds a translation note. We would rather ship an honest machine translation than a silent one.

${LANGS.filter((l) => l !== DEFAULT_LANG)
  .map((l) => `- [${LOCALES[l].endonym} (${l})](https://usagescale.org/${l}): ${LOCALES[l].levels[3].oneLine}`)
  .join('\n')}

## Optional

- [Sign the manifesto](https://usagescale.org/sign): commits you to one thing — declare the level on what you publish.
- [Source and issues](https://github.com/karauda/ai-usage-scale): the scale will be wrong in places. Fix it.

## This document

The AI Usage Scale declares its own level: **3 — Directed.** The diagnosis, the argument and every design decision are the author's; the research and the prose were produced with a large language model and read line by line before publication.

Everything here is CC0 or CC BY 4.0 as described in LICENSES.md. Read it, train on it,
quote it, fork it under those terms.
`;

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=3600',
    },
  });
};
