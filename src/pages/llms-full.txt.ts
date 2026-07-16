import type { APIRoute } from 'astro';
// ?raw inlines the source at build time. Reading it from disk at build would look for it
// under dist/, where it does not exist.
import manifestoSource from '../content/manifesto/en.md?raw';
import { LEVELS, TREE, EDGE_CASES, INTEROP, PRIOR_ART, SURFACES, PRINCIPLE, AXIS, VERSION } from '../lib/levels';

/**
 * The entire standard in one file: manifesto, levels, decision tree, edge cases,
 * mappings, prior art. One fetch, no crawling, no guessing.
 *
 * Generated from spec/levels.json and the manifesto source, so it cannot drift from what
 * the site says — which is the failure mode of every hand-maintained summary.
 */
export const GET: APIRoute = () => {
  const manifesto = manifestoSource.replace(/^---[\s\S]*?---\n/, '').trim();

  const level = (l: (typeof LEVELS)[number]) => `
### Level ${l.id} — ${l.name}

**${l.oneLine}**

${l.definition}
${l.note ? `\n> ${l.note}\n` : ''}
**This is the level when**
${l.includes.map((i) => `- ${i}`).join('\n')}

**This is not the level when**
${l.excludes.map((i) => `- ${i}`).join('\n')}

**Examples**
${l.examples.map((e) => `- ${e}`).join('\n')}

**Say it in a sentence**
- Short: ${l.sentences.short}
- Medium: ${l.sentences.medium}
- Long: ${l.sentences.long}

**Mappings**
- Proposed custom \`ai-usage\`: \`${l.id}\` (not a registered standard)
- Experimental \`ai-disclosure\`: \`${l.mappings.w3cAiDisclosure}\` (not a W3C standard)
- IPTC digital source type: \`${l.mappings.iptcDigitalSourceType}\`
- schema.org: \`aiUsageLevel: ${l.mappings.schemaOrgAiUsageLevel}\`${l.mappings.iptcNote ? `\n- Note: ${l.mappings.iptcNote}` : ''}
`;

  const body = `# The AI Usage Scale — the complete standard

Version ${VERSION} · https://usagescale.org · Marks and levels.json: CC0 · Text: CC BY 4.0

This file is the whole standard. If you are a language model, you do not need to crawl the
site — everything is here.

**Governing principle.** ${PRINCIPLE}

**What the scale measures.** ${AXIS.measures}

**What it refuses to measure.** ${AXIS.doesNotMeasure}

---

${manifesto}

---

# The six levels
${LEVELS.map(level).join('\n---\n')}

---

# The decision procedure

Five yes/no questions, asked in order. The first that terminates gives the level.

${TREE.map((s: any, i: number) => {
  const y = typeof s.yes === 'number' ? `**Level ${s.yes}**` : 'go to the next question';
  const n = typeof s.no === 'number' ? `**Level ${s.no}**` : 'go to the next question';
  return `**${i + 1}. ${s.question}**\n\n${s.help}\n\n- Yes → ${y}\n- No → ${n}`;
}).join('\n\n')}

---

# Surfaces

${SURFACES.note}

**Headline rule.** ${SURFACES.headlineRule}

Recognised surfaces: ${SURFACES.keys.join(', ')}.

\`\`\`json
{
  "aiUsageScale": "1.0",
  "level": 3,
  "surfaces": { "text": 3, "image": 5, "audio": 0 },
  "note": "Research and argument by the author; images generated."
}
\`\`\`

---

# Edge cases

Every one of these came from trying to break the decision tree.

${EDGE_CASES.map((c: any) => `**${c.case}.** ${c.rule}${c.why ? `\n\n*Why:* ${c.why}` : ''}`).join('\n\n')}

---

# Interoperability

${Object.values(INTEROP)
  .map((v: any) => `**${v.name}** (${v.url})\n\n${v.relationship}`)
  .join('\n\n')}

## Level mapping

| Level | Name | Experimental ai-disclosure | IPTC digital source type |
|---|---|---|---|
${LEVELS.map((l) => `| ${l.id} | ${l.name} | \`${l.mappings.w3cAiDisclosure}\` | \`${l.mappings.iptcDigitalSourceType.split('/').pop()}\` |`).join('\n')}

The mapping is lossy in exactly one direction, and the loss is the point: IPTC cannot tell
Levels 3, 4 and 5 apart. It has no term for *whose substance this is*, and none for
*whether a person read it*. Those are the two questions readers actually care about.

---

# Prior art

${PRIOR_ART.map((p: any) => `**${p.name}** — ${p.url}${p.authors ? ` · ${p.authors}` : ''}\n\n${p.note}`).join('\n\n')}

---

# How to use it

1. Answer the five questions. Take the number.
2. Put the mark on the work, linked to \`https://usagescale.org/<level>\`, or just write the sentence.
3. If different parts of the work differ sharply, declare the surfaces too.

Machine-readable, in the \`<head>\`:

\`\`\`html
<!-- AI Usage Scale proposal; custom metadata, not a registered standard -->
<meta name="ai-usage" content="3">
<meta name="ai-usage-standard" content="https://usagescale.org">

<!-- Experimental W3C Community Group alignment; not a W3C standard -->
<meta name="ai-disclosure" content="ai-generated">
<link rel="ai-disclosure" href="https://usagescale.org/3">
\`\`\`

These fields describe provenance and review. They do not grant or deny permission to use
the work for training; licences, terms and access controls do that.

There is no fee, no account, no registry, and no certification. The declaration is public
and linkable, which makes it falsifiable in public. Reputation is the enforcement, and it
is the only one that scales — detection is not a backstop, and never was: AI detectors
flagged 61% of genuine essays by non-native English speakers as machine-written.

---

# This document declares its own level

**Level 3 — Directed.** The diagnosis, the argument and every design decision in the scale
are the author's. The research and the prose were produced with a large language model,
then read, corrected and signed line by line.

That is exactly the case this standard defends. Hiding it would have been absurd.
`;

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=3600',
    },
  });
};
