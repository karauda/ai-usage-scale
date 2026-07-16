import type { APIRoute } from 'astro';
import { LEVELS } from '../lib/levels';

/**
 * JSON Schema for an AI Usage declaration.
 *
 * So a third-party tool — a CMS plugin, a validator, a crawler — can check that a declaration is
 * well-formed without hard-coding the rules. Generated from spec/levels.json, so the level names
 * and range can never drift from the standard itself.
 */

const SITE = 'https://usagescale.org';

export const GET: APIRoute = () => {
  const schema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: `${SITE}/levels.schema.json`,
    title: 'AI Usage Scale declaration',
    description:
      'A declaration of how a work was made, on the AI Usage Scale. Describes contribution and review; it does not grant or deny any training right. See https://usagescale.org/spec.',
    type: 'object',
    properties: {
      aiUsageScale: { const: '1.0', description: 'Declaration format version.' },
      level: {
        type: 'integer',
        minimum: 0,
        maximum: 5,
        description: 'The overall AI Usage level, 0–5. No level ranks above another.',
      },
      name: { enum: LEVELS.map((l) => l.name), description: 'The level name (redundant with `level`).' },
      surfaces: {
        type: 'object',
        description: 'Optional per-surface levels for a composite work.',
        propertyNames: { enum: ['text', 'image', 'audio', 'video', 'code', 'data'] },
        additionalProperties: { type: 'integer', minimum: 0, maximum: 5 },
      },
      statement: { type: 'string', description: 'Optional human-readable disclosure sentence.' },
      translation: {
        type: 'object',
        description: 'Present when this is a translation; inherits the source level and states its review state.',
        properties: { by: { enum: ['machine', 'human'] }, review: { enum: ['unreviewed', 'human-reviewed', 'community-verified'] } },
      },
      definition: {
        type: 'string',
        format: 'uri',
        description: 'Canonical URL for this level, e.g. https://usagescale.org/3.',
      },
    },
    required: ['level'],
    additionalProperties: true,
    examples: [{ aiUsageScale: '1.0', level: 3, name: 'Directed', definition: `${SITE}/3` }],
  };
  return new Response(JSON.stringify(schema, null, 2), {
    headers: { 'Content-Type': 'application/schema+json; charset=utf-8' },
  });
};
