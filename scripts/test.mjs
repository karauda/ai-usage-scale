/**
 * The scale is the product. These tests guard it.
 *
 * Run in CI on every pull request. A change to spec/levels.json that breaks any of
 * these is a change to what a level *means* — which silently invalidates every badge
 * already published against it. That is the one thing this project must never do by
 * accident.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const spec = JSON.parse(readFileSync(join(ROOT, 'spec', 'levels.json'), 'utf8'));

let failed = 0;
const check = (name, fn) => {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}\n      ${e.message}`);
    failed++;
  }
};
const eq = (a, b, msg) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg ?? ''} expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
};
const ok = (v, msg) => { if (!v) throw new Error(msg); };

/** Walk the decision tree with a fixed list of yes/no answers. */
function walk(answers) {
  for (let i = 0; i < spec.decisionTree.length; i++) {
    const step = spec.decisionTree[i];
    const out = step[answers[i] ? 'yes' : 'no'];
    if (typeof out === 'number') return out;
  }
  throw new Error(`tree did not terminate for ${answers}`);
}

console.log('\nThe decision tree');

check('terminates for every one of the 32 answer combinations', () => {
  for (let bits = 0; bits < 32; bits++) {
    const answers = [0, 1, 2, 3, 4].map((i) => Boolean(bits & (1 << i)));
    const level = walk(answers);
    ok(Number.isInteger(level) && level >= 0 && level <= 5, `bad level ${level} for ${answers}`);
  }
});

check('every level 0–5 is reachable', () => {
  const reached = new Set();
  for (let bits = 0; bits < 32; bits++) {
    reached.add(walk([0, 1, 2, 3, 4].map((i) => Boolean(bits & (1 << i)))));
  }
  eq([...reached].sort((a, b) => a - b), [0, 1, 2, 3, 4, 5], 'not all levels reachable:');
});

console.log('\nThe cases this scale exists for');

// [name, answers, expected level]
const CASES = [
  ['no generative AI at all',                        [false],                              0],
  ['my article, grammar-checked by a model',         [true, false],                        1],
  ['my podcast, auto-transcribed',                   [true, false],                        1],
  ['I wrote most of it; AI drafted two paragraphs',  [true, true, true],                   2],
  ['the surgeon: my knowledge, AI wrote the prose',  [true, true, false, true],            3],
  ['founder notes → landing page written by a model',[true, true, false, true],            3],
  ['"write ten posts about X", read before posting', [true, true, false, false, true],     4],
  ['unattended pipeline, nobody read it',            [true, true, false, false, false],    5],
];

for (const [name, answers, expected] of CASES) {
  check(`${name} → Level ${expected}`, () => eq(walk(answers), expected));
}

console.log('\nThe standard');

check('exactly six levels, 0 through 5', () => {
  eq(spec.levels.map((l) => l.id), [0, 1, 2, 3, 4, 5]);
});

check('every level maps to one experimental ai-disclosure value', () => {
  const valid = new Set(spec.interop.w3c.values);
  for (const l of spec.levels) {
    ok(valid.has(l.mappings.w3cAiDisclosure), `Level ${l.id} → "${l.mappings.w3cAiDisclosure}" is not a W3C value`);
  }
});

check('the experimental mapping is monotonic (a higher level never claims less AI)', () => {
  const rank = { none: 0, 'ai-assisted': 1, 'ai-generated': 2, autonomous: 3 };
  let prev = -1;
  for (const l of spec.levels) {
    const r = rank[l.mappings.w3cAiDisclosure];
    ok(r >= prev, `Level ${l.id} (${l.mappings.w3cAiDisclosure}) ranks below Level ${l.id - 1}`);
    prev = r;
  }
});

check('every level maps to a real IPTC digital source type', () => {
  for (const l of spec.levels) {
    ok(
      l.mappings.iptcDigitalSourceType.startsWith('http://cv.iptc.org/newscodes/digitalsourcetype/'),
      `Level ${l.id} has a malformed IPTC URI`
    );
  }
});

check('every level carries all three disclosure sentences', () => {
  for (const l of spec.levels) {
    for (const k of ['short', 'medium', 'long']) {
      ok(l.sentences?.[k]?.length > 10, `Level ${l.id} is missing a ${k} sentence`);
    }
    ok(l.sentences.short.includes(String(l.id)), `Level ${l.id}'s short sentence omits its own number`);
  }
});

check('every level has examples, includes, and a one-liner', () => {
  for (const l of spec.levels) {
    ok(l.oneLine?.length > 10, `Level ${l.id} has no one-liner`);
    ok(l.examples?.length >= 1, `Level ${l.id} has no examples`);
    ok(l.includes?.length >= 1, `Level ${l.id} has no includes`);
    ok(l.definition?.length > 40, `Level ${l.id} has no definition`);
  }
});

check('no level is ranked above another anywhere in the copy', () => {
  // The one rule that, if broken, turns the scale back into a shame ladder.
  const banned = /\b(better|worse|best|worst|superior|inferior|good level|bad level)\b/i;
  for (const l of spec.levels) {
    // Scan every English text surface, not just three: a banned word hiding in a sentence,
    // example or include ships the shame ladder while the narrow scan stays green.
    const text = [
      l.name, l.oneLine, l.definition, l.note ?? '',
      ...(l.examples ?? []), ...(l.includes ?? []),
      l.sentences?.short, l.sentences?.medium, l.sentences?.long,
    ].join(' ');
    ok(!banned.test(text), `Level ${l.id} ranks itself: "${text.match(banned)?.[0]}"`);
  }
});

console.log('\nThe marks');

const badgeDir = join(ROOT, 'public', 'badge');
const svgs = readdirSync(badgeDir).filter((f) => f.endsWith('.svg'));

check('all 24 marks are generated', () => eq(svgs.length, 24));

check('no mark contains a non-finite coordinate', () => {
  // opentype's own serialiser emits NaN, and one NaN truncates the text mid-glyph.
  for (const f of svgs) {
    const s = readFileSync(join(badgeDir, f), 'utf8');
    ok(!/NaN|Infinity|undefined/.test(s), `${f} contains a non-finite value`);
  }
});

check('no two marks share an element id', () => {
  // Ids are document-global. Inlining two badges on one page must not corrupt either.
  const seen = new Map();
  for (const f of svgs) {
    const s = readFileSync(join(badgeDir, f), 'utf8');
    for (const m of s.match(/id="([^"]+)"/g) ?? []) {
      const id = m.slice(4, -1);
      ok(!seen.has(id), `id "${id}" is in both ${seen.get(id)} and ${f}`);
      seen.set(id, f);
    }
  }
});

check('no mark fetches anything', () => {
  for (const f of svgs) {
    const s = readFileSync(join(badgeDir, f), 'utf8');
    // `\bhref="https?:` catches <use href="http…"> / <image href> / xlink:href alike — the
    // badges only ever use href="#glyph", so any http(s) href is by definition external.
    ok(!/<image|\bhref="https?:|url\(http|@import|font-family/.test(s), `${f} pulls in an external resource`);
  }
});

check('all six marks use one ink (no level is coloured differently)', () => {
  const inkOf = (f) => [...new Set((readFileSync(join(badgeDir, f), 'utf8').match(/#[0-9A-Fa-f]{6}/g) ?? []))].sort();
  for (const variant of ['', '-stamp']) {
    for (const theme of ['', '-dark']) {
      const inks = [0, 1, 2, 3, 4, 5].map((i) => inkOf(`${i}${variant}${theme}.svg`).join(','));
      ok(new Set(inks).size === 1, `marks ${variant || 'chip'}${theme} do not share one ink: ${[...new Set(inks)].join(' | ')}`);
    }
  }
});


// ── Translations ──────────────────────────────────────────────────────────────
// A broken translation is worse than a missing one: it ships a standard that says
// something different in one language than in another, which is precisely the failure
// this project exists to end.

console.log('\nTranslations');

const i18nDir = join(ROOT, 'src', 'i18n');
const langs = readdirSync(i18nDir).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
const en = JSON.parse(readFileSync(join(i18nDir, 'en.json'), 'utf8'));

/** Same keys, same array lengths, all the way down. */
function sameShape(a, b, path = '') {
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) throw new Error(`${path}: expected array of ${a.length}`);
    a.forEach((v, i) => sameShape(v, b[i], `${path}[${i}]`));
  } else if (a && typeof a === 'object') {
    if (!b || typeof b !== 'object') throw new Error(`${path}: expected object`);
    for (const k of Object.keys(a)) {
      if (!(k in b)) throw new Error(`${path}.${k} is missing`);
      sameShape(a[k], b[k], `${path}.${k}`);
    }
  }
}

check(`${langs.length} locales load and match the English shape`, () => {
  for (const lang of langs) {
    const loc = JSON.parse(readFileSync(join(i18nDir, `${lang}.json`), 'utf8'));
    sameShape(en, loc, lang);
    ok(loc.lang === lang, `${lang}.json declares lang="${loc.lang}"`);
    ok(loc.endonym?.length, `${lang} has no endonym — the switcher would show a blank`);
    ok(loc.dir === 'ltr' || loc.dir === 'rtl', `${lang} has dir="${loc.dir}"`);
    ok(loc.levels.length === 6, `${lang} has ${loc.levels.length} levels`);
    ok(loc.tree.length === 5, `${lang} has ${loc.tree.length} questions`);
  }
});

check('every translation declares itself, and only English does not', () => {
  // The scale's own translation rule, applied to the scale. A silent machine translation
  // of a transparency standard would discredit it faster than anything a critic could write.
  for (const lang of langs) {
    const loc = JSON.parse(readFileSync(join(i18nDir, `${lang}.json`), 'utf8'));
    if (lang === 'en') ok(loc.translation === null, 'en must be the source (translation: null)');
    else ok(loc.translation?.by === 'machine' || loc.translation?.by === 'human', `${lang} does not declare how it was translated`);
  }
});

check('no translation dropped an interpolation placeholder', () => {
  // A lost {n} does not crash — it silently prints "Question {n} of 5" to a reader.
  // Per string, not a global multiset: moving {n} out of string A into string B keeps the total
  // count unchanged while string A now renders a literal "{n}" to its reader.
  const holes = (o, path = '', acc = {}) => {
    if (typeof o === 'string') {
      const h = (o.match(/\{\w+\}/g) ?? []).sort().join(',');
      if (h) acc[path] = h;
    } else if (o && typeof o === 'object') {
      for (const k of Object.keys(o)) holes(o[k], path ? `${path}.${k}` : k, acc);
    }
    return acc;
  };
  const want = holes(en.ui);
  for (const lang of langs) {
    const loc = JSON.parse(readFileSync(join(i18nDir, `${lang}.json`), 'utf8'));
    const got = holes(loc.ui);
    for (const key of Object.keys(want)) {
      ok(got[key] === want[key], `${lang}: ui.${key} placeholders "${got[key] ?? '(none)'}", expected "${want[key]}"`);
    }
  }
});

check('every language has a manifesto', () => {
  const dir = join(ROOT, 'src', 'content', 'manifesto');
  const files = readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace('.md', ''));
  for (const lang of langs) ok(files.includes(lang), `${lang} has no manifesto`);
});

check('every manifesto keeps its 15 theses and 12 sources', () => {
  const dir = join(ROOT, 'src', 'content', 'manifesto');
  for (const lang of langs) {
    const md = readFileSync(join(dir, `${lang}.md`), 'utf8');
    const theses = (md.match(/^### /gm) ?? []).length;
    ok(theses === 15, `${lang}: ${theses} theses, expected 15`);
    for (let i = 1; i <= 12; i++) {
      ok(md.includes(`[^${i}]:`), `${lang}: footnote ${i} is missing its source`);
    }
    ok(!md.includes('missionmedia.asia'), `${lang}: stale secondary WFA source remains`);
    ok(!/^### \d+\./m.test(md), `${lang}: a thesis heading was re-numbered — a CSS counter does that`);
  }
});

console.log(failed ? `\n${failed} failed\n` : '\nall passed\n');
process.exit(failed ? 1 : 0);
