import type { APIRoute } from 'astro';
import { LEVELS, VERSION } from '../lib/levels';
import { LANGS, LOCALES } from '../lib/i18n';
export const GET: APIRoute = () => new Response(`# AI Usage Scale

> An independent, open proposal for describing the role of generative AI in a work. Six levels, 0–5. Definitions version ${VERSION}. Marks and vocabulary: CC0.

The numbers describe a process, not quality. A level is a self-declaration; it does not
certify accuracy, copyright, legal compliance or human review beyond what its definition
requires. Absence of a declaration means unknown. This is a provenance signal, not training permission.

## Levels

${LEVELS.map(l => `- [${l.id} — ${l.name}](https://usagescale.org/${l.id}): ${l.oneLine}`).join('\n')}

## Reference

- [Full reference](https://usagescale.org/llms-full.txt): definitions, decision procedure, edge cases and suggested mappings.
- [Specification](https://usagescale.org/spec): normative English source and declaration formats.
- [Vocabulary JSON](https://usagescale.org/levels.json): definitions and decision procedure, CC0.
- [Vocabulary JSON Schema](https://usagescale.org/spec.schema.json): validates a vocabulary document.
- [Declaration JSON Schema](https://usagescale.org/levels.schema.json): validates a publisher's declaration object.
- [Find a level](https://usagescale.org/find-your-level): five questions; check the complete definition before declaring.
- [Marks](https://usagescale.org/badges): self-contained SVGs for local hosting or inlining.
- [Worked examples](https://usagescale.org/cases): illustrative scenarios, not adopters or certifications.
- [Integrations](https://usagescale.org/integrations): endpoints and local MCP source.
- [Project status](https://usagescale.org/project): evidence of public references, review status and standards discussion.
- [EU AI Act](https://usagescale.org/eu-ai-act): links and scope distinctions; a level is not a compliance assessment.
- [Release feed](https://usagescale.org/feed.xml): published version history.

## Status and limitations

The HTML metadata is proposed custom syntax. The JSON-LD property aiUsageLevel is explicitly
mapped to a project IRI; it is not a Schema.org property or a documented Google Search feature.
IPTC mappings are medium-dependent suggestions; they do not imply endorsement by IPTC or C2PA.
W3C Community Group discussions are not W3C Recommendations.

The five-question tree reaches Level 3 before asking about review. Its full definition
requires meaningful human review. An unreviewed result from human substance is an open
boundary: document the process and do not infer review from the tree alone.

The October 2026 site revision was developed with AI. Human editorial review is pending.
Translations are machine-produced and awaiting fluent human review; they are not additional normative sources.

## Languages

${LANGS.map(code => `- [${LOCALES[code].endonym}](https://usagescale.org${code === 'en' ? '/' : `/${code}`}): ${code === 'en' ? 'normative English source' : 'machine translation, unreviewed'}`).join('\n')}

## Source

- [Repository](https://github.com/karauda/ai-usage-scale): source, governance, licences and issues.
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' } });
