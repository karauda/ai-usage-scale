#!/usr/bin/env node
/**
 * usagescale-mcp — the AI Usage Scale as an MCP server.
 *
 * Lets an AI agent query the standard directly instead of scraping the site: walk the five
 * questions to a level, look one up, or read the spec. Runs over stdio, needs no network — the
 * whole standard travels inside the package.
 *
 * The low-level Server API is used deliberately: it has been stable across SDK versions, and
 * the tool schemas are plain JSON Schema, so there is no zod (or any second dependency) to drift.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { classify } from './classify.js';

const here = dirname(fileURLToPath(import.meta.url));
// The canonical spec when run from the repo; the bundled copy when published to npm.
// Prefer the repo's spec/levels.json so a stale synced copy left in this directory can
// never shadow it during local development — the published package has no ../spec to find.
const specPath = existsSync(join(here, '..', 'spec', 'levels.json'))
  ? join(here, '..', 'spec', 'levels.json')
  : join(here, 'levels.json');
let spec;
try {
  spec = JSON.parse(readFileSync(specPath, 'utf8'));
} catch (err) {
  console.error(
    `usagescale-mcp: cannot read the scale at ${specPath} (${err.message}).\n` +
      'From the repo, run `npm run sync` or make sure spec/levels.json exists.'
  );
  process.exit(1);
}

const SITE = 'https://usagescale.org';
const level = (id) => spec.levels.find((l) => l.id === Number(id));

const text = (t) => ({ content: [{ type: 'text', text: typeof t === 'string' ? t : JSON.stringify(t, null, 2) }] });

const TOOLS = [
  {
    name: 'classify',
    description:
      'Walk the five yes/no questions to an AI Usage level (0–5). Pass answers in order; the walk stops as soon as a level is reached, so fewer than five may be enough.',
    inputSchema: {
      type: 'object',
      properties: {
        answers: {
          type: 'array',
          items: { type: 'boolean' },
          description:
            'In order: (1) any generative AI used? (2) did AI produce new material that survived, beyond mechanically processing what you already made? (3) did you make most of the final form yourself? (4) is the substance yours — knowledge, data, argument? (5) did a human review it before publication?',
        },
      },
      required: ['answers'],
    },
  },
  {
    name: 'get_level',
    description: 'Full definition of one level: name, one-liner, definition, examples, disclosure sentences and interop mappings.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'integer', minimum: 0, maximum: 5 } },
      required: ['id'],
    },
  },
  { name: 'list_levels', description: 'All six levels: id, name, one-liner.', inputSchema: { type: 'object', properties: {} } },
  {
    name: 'get_spec',
    description: 'The whole machine-readable spec: levels, decision tree, edge cases, interop mappings. Equivalent to /levels.json.',
    inputSchema: { type: 'object', properties: {} },
  },
];

const server = new Server(
  { name: 'usagescale', version: spec.version ?? '1.0.0' },
  { capabilities: { tools: {}, resources: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args = {} } = req.params;

  if (name === 'classify') {
    const answers = Array.isArray(args.answers) ? args.answers.map(Boolean) : [];
    const id = classify(spec.decisionTree, answers);
    if (id === null)
      return { ...text('Not enough answers to reach a level. Provide up to five booleans in order.'), isError: true };
    const l = level(id);
    return text({ level: id, name: l.name, oneLine: l.oneLine, definition: `${SITE}/${id}`, sentence: l.sentences.short });
  }

  if (name === 'get_level') {
    const l = level(args.id);
    if (!l) return { ...text(`No level with id ${args.id}. Levels are 0–5.`), isError: true };
    return text({ ...l, url: `${SITE}/${l.id}` });
  }

  if (name === 'list_levels')
    return text(spec.levels.map((l) => ({ id: l.id, name: l.name, oneLine: l.oneLine, url: `${SITE}/${l.id}` })));

  if (name === 'get_spec') return text(spec);

  return { ...text(`Unknown tool: ${name}`), isError: true };
});

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'usagescale://levels.json',
      name: 'AI Usage Scale — levels.json',
      description: 'The complete machine-readable standard: levels, decision tree, edge cases, mappings. CC0.',
      mimeType: 'application/json',
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
  if (req.params.uri === 'usagescale://levels.json')
    return { contents: [{ uri: req.params.uri, mimeType: 'application/json', text: JSON.stringify(spec, null, 2) }] };
  throw new Error(`Unknown resource: ${req.params.uri}`);
});

await server.connect(new StdioServerTransport());
