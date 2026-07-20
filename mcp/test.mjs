/**
 * Guards the one piece of logic the MCP server adds: the classify walk. Pure, no SDK, no spawn —
 * runs anywhere `spec/levels.json` is present, including CI.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { classify } from './classify.js';

const here = dirname(fileURLToPath(import.meta.url));
const specPath = existsSync(join(here, '..', 'spec', 'levels.json')) ? join(here, '..', 'spec', 'levels.json') : join(here, 'levels.json');
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const tree = spec.decisionTree;

let failed = 0;
const eq = (name, got, want) => {
  if (got === want) console.log(`  ✓ ${name}`);
  else {
    console.error(`  ✗ ${name}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
    failed++;
  }
};

console.log('\nMCP classify');

// The cases the standard exists for (same as the site's suite).
eq('no generative AI → 0', classify(tree, [false]), 0);
eq('grammar-check only → 1', classify(tree, [true, false]), 1);
eq('I made most of the form → 2', classify(tree, [true, true, true]), 2);
eq('surgeon: substance mine, AI wrote it → 3', classify(tree, [true, true, false, true]), 3);
eq('read before posting → 4', classify(tree, [true, true, false, false, true]), 4);
eq('unattended, nobody read it → 5', classify(tree, [true, true, false, false, false]), 5);

// The bug this file exists for: partial input must NOT resolve to a confident wrong level.
eq('no answers → null (not Level 0)', classify(tree, []), null);
eq('too few answers → null (not Level 5)', classify(tree, [true, true]), null);

console.log(failed ? `\n${failed} failed\n` : '\nall passed\n');
process.exit(failed ? 1 : 0);
