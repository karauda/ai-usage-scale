import type { APIRoute } from 'astro';
import { LEVELS, TREE, EDGE_CASES, INTEROP, SURFACES, VERSION } from '../lib/levels';
import { embedMeta } from '../lib/levels';
export const GET: APIRoute = () => {
  const body = `# AI Usage Scale — complete reference

Independent proposal. Definitions version ${VERSION}. https://usagescale.org
Vocabulary and marks: CC0. Reference prose: CC BY 4.0. Site code: MIT.

Levels describe different processes, not quality. A level is a publisher's self-declaration.
Absence of a declaration means unknown. The October 2026 site revision was developed with
AI and is pending human editorial review. This file does not claim human approval.

## Six definitions

${LEVELS.map(l => `### ${l.id} — ${l.name}

${l.oneLine}

${l.definition}

Included:
${l.includes.map(text => `- ${text}`).join('\n')}

Excluded:
${l.excludes.map(text => `- ${text}`).join('\n')}

Examples:
${l.examples.map(text => `- ${text}`).join('\n')}

Disclosure sentences:
- ${l.sentences.short}
- ${l.sentences.medium}
- ${l.sentences.long}

Suggested mappings:
- Custom ai-usage: ${l.id} (not a registered standard)
- Experimental ai-disclosure: ${l.mappings.w3cAiDisclosure} (not a W3C Recommendation)
- Suggested IPTC digital source type: ${l.mappings.iptcDigitalSourceType}
- IPTC note: ${l.mappings.iptcNote ?? ''}
- Illustrative EU icon: ${l.mappings.euAiActIcon ?? 'none suggested'}
- EU scope note: ${l.mappings.euAiActNote ?? ''}`).join('\n\n')}

## Decision procedure

Ask these five questions in order, stopping at the first numeric outcome.

${TREE.map((step, index) => `### ${index + 1}. ${step.question}

${step.help}

- Yes: ${'yes' in step ? `Level ${step.yes}` : 'next question'}
- No: ${'no' in step ? `Level ${step.no}` : 'next question'}`).join('\n\n')}

The tree reaches Level 3 before the final review question. The full Level 3 definition
requires meaningful human review. Do not infer review from the tree alone. Unreviewed
AI output shaped by original human inputs is an open boundary requiring a documented
process and a specification decision, rather than an automatic claim of Level 3.

## Surfaces

${SURFACES.note}

${SURFACES.headlineRule}

Supported keys: ${SURFACES.keys.join(', ')}.

## Edge cases

${EDGE_CASES.map(c => `### ${c.case}

${c.rule}${'why' in c ? `\n\n${c.why}` : ''}`).join('\n\n')}

## Suggested relationships to other standards

${Object.values(INTEROP).map(entry => `### ${entry.name}

${entry.url}

${entry.relationship}`).join('\n\n')}

IPTC terms must be chosen for the actual medium and processing history; the scale's mapping
is not universally applicable to text, research assistance, or every composite asset.
No listed standards body endorses this proposal. Google Search has no documented dedicated
feature for these levels. The legacy schemaOrgAiUsageLevel field does not identify a
Schema.org property.

## Example metadata for a Level 3 work

${embedMeta(3)}

Use this only when the complete Level 3 definition describes the work. A sample is not
a declaration about this reference document. The metadata describes process, not training
permission, copyright or legal compliance.

## Validation

- /spec.schema.json validates vocabulary documents.
- /levels.schema.json validates declaration objects.
- /.well-known/ai-disclosure.json is an optional project convention, not a registered well-known URI.
- /project records review and adoption evidence.
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' } });
};
