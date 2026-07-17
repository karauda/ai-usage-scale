/**
 * Generates the AI Usage Scale badge family.
 *
 * Three rules govern every mark here:
 *
 *  1. All six levels share one ink. No colour runs from "good" to "bad", because the
 *     scale has no moral temperature. Level 5 is the honest answer for an automated
 *     market report; Level 0 is the honest answer for a memoir. A badge that coloured
 *     5 red would rebuild the binary we are trying to retire.
 *
 *  2. The type is outlined, not set. A badge gets pasted onto a stranger's site where
 *     our fonts do not exist, so it cannot depend on them — and it must not phone home
 *     to fetch them either. A transparency standard does not ship a tracking pixel.
 *
 *  3. It has to be small enough that nobody hesitates. Outlining every glyph separately
 *     put the stamp at 48 KB. Monospace repeats characters heavily, so each distinct
 *     (glyph, size) is defined once and referenced with <use>. That plus one decimal of
 *     coordinate precision — 0.1px, far below anything visible — cuts it by ~4x.
 *
 * Serialisation note: opentype's own toPathData() emits `NaN` for some coordinates (its
 * rounding helper does Math.round(x + 'e+2'), which breaks on certain floats). A single
 * NaN makes the browser abandon the path mid-glyph, so text silently truncates. We
 * serialise the command list ourselves, and the build asserts the output is clean.
 */
import pkg from 'opentype.js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const { parse } = pkg;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'badge');

const load = (f) => {
  const b = readFileSync(join(ROOT, 'src', 'fonts', f));
  return parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};
const FONTS = { r: load('IBMPlexMono-Regular.ttf'), b: load('IBMPlexMono-SemiBold.ttf') };

const { levels } = JSON.parse(readFileSync(join(ROOT, 'spec', 'levels.json'), 'utf8'));

const num = (v) => {
  const r = Math.round(v * 10) / 10;
  if (!Number.isFinite(r)) throw new Error(`non-finite coordinate: ${v}`);
  return String(r);
};

function serialise(path) {
  let d = '';
  for (const c of path.commands) {
    if (c.type === 'M') d += `M${num(c.x)} ${num(c.y)}`;
    else if (c.type === 'L') d += `L${num(c.x)} ${num(c.y)}`;
    else if (c.type === 'C') d += `C${num(c.x1)} ${num(c.y1)} ${num(c.x2)} ${num(c.y2)} ${num(c.x)} ${num(c.y)}`;
    else if (c.type === 'Q') d += `Q${num(c.x1)} ${num(c.y1)} ${num(c.x)} ${num(c.y)}`;
    else if (c.type === 'Z') d += 'Z';
  }
  return d;
}

/**
 * Collects each distinct (font, char, size) once and hands back <use> references.
 *
 * `prefix` must be unique per badge. Element ids are global to the *document*, so when
 * several badges are inlined on one page — which is exactly how we recommend using them —
 * a shared id like "g0" makes every <use> in every later badge resolve against the first
 * badge's defs. The visible result is six marks all rendering level 0's glyphs.
 */
function glyphPool(prefix) {
  const defs = new Map();
  return {
    /** @returns {string} a run of <use> elements for `text`, laid out from (x, y). */
    run(fontKey, text, size, x, y, tracking = 0) {
      const font = FONTS[fontKey];
      let cursor = x;
      let out = '';
      for (const ch of text) {
        const key = `${fontKey}-${size}-${ch.codePointAt(0)}`;
        if (!defs.has(key)) {
          const d = serialise(font.charToGlyph(ch).getPath(0, 0, size));
          if (d) defs.set(key, { id: `${prefix}${defs.size.toString(36)}`, d });
          else defs.set(key, null); // whitespace: advances, draws nothing
        }
        const g = defs.get(key);
        if (g) out += `<use href="#${g.id}" x="${num(cursor)}" y="${num(y)}"/>`;
        cursor += (font.charToGlyph(ch).advanceWidth / font.unitsPerEm) * size + tracking;
      }
      return out;
    },
    defs() {
      const entries = [...defs.values()].filter(Boolean);
      return entries.length
        ? `<defs>${entries.map((g) => `<path id="${g.id}" d="${g.d}"/>`).join('')}</defs>`
        : '';
    },
  };
}

const charW = (fontKey, size, tracking) =>
  (FONTS[fontKey].charToGlyph('0').advanceWidth / FONTS[fontKey].unitsPerEm) * size + tracking;
const advance = (fontKey, text, size, tracking = 0) =>
  text.length * charW(fontKey, size, tracking) - tracking;

/* `auto` inherits the host page's text colour (currentColor), so one inline mark is legible
   on any background without picking a theme. Only for inlining: inside an <img>, currentColor
   resolves to black, so the hosted files stay on fixed inks. */
const INK = { light: '#16191B', dark: '#ECEEE9', auto: 'currentColor' };

/**
 * Six marks, one filled. A *position* on a scale, never a *quantity* in a tank —
 * a fuel gauge would read "fuller is worse", and that is the reading we must not allow.
 */
function ticks(level, x, y, h, ink) {
  const w = 2.5, gap = 2.5;
  let svg = '';
  for (let i = 0; i <= 5; i++) {
    const on = i === level;
    const th = on ? h : h * 0.45;
    // The concept is "six marks, one filled". At 0.3 the other five vanished at byline size,
    // so the eye saw one bar and a number — not a scale. 0.4 makes the track legibly present
    // while the filled mark still clearly dominates.
    svg += `<rect x="${num(x + i * (w + gap))}" y="${num(y + (h - th) / 2)}" width="${w}" height="${num(th)}" fill="${ink}" opacity="${on ? 1 : 0.4}"/>`;
  }
  return svg;
}
const TICKS_W = 6 * 2.5 + 5 * 2.5;

// Keep in sync with levelAlt() in src/lib/levels.ts (English default). This script is plain
// Node and cannot import the .ts helper, so the one format lives in two places on purpose.
const alt = (l) => `AI Usage Scale: Level ${l.id} — ${l.name}. ${l.oneLine}`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Inline chip — lives in a byline at 18–24px without shouting. */
function chip(level, theme) {
  const H = 24, ink = INK[theme], pad = 9, gap = 9;
  const LABEL = 'AI USAGE', ls = 9.5, tr = 0.75, ns = 13.5;
  const p = glyphPool(`aus-c${level.id}${theme[0]}-`);

  const labelW = advance('b', LABEL, ls, tr);
  const numW = advance('b', String(level.id), ns);
  const W = pad + labelW + gap + TICKS_W + gap + numW + pad;

  const label = p.run('b', LABEL, ls, pad, H / 2 + ls * 0.35, tr);
  const digit = p.run('b', String(level.id), ns, pad + labelW + gap + TICKS_W + gap, H / 2 + ns * 0.36);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${num(W)}" height="${H}" viewBox="0 0 ${num(W)} ${H}" role="img" aria-label="${esc(alt(level))}">
<title>${esc(alt(level))}</title>
${p.defs()}
<rect x="0.5" y="0.5" width="${num(W - 1)}" height="${H - 1}" fill="none" stroke="${ink}" stroke-opacity="0.55"/>
<g fill="${ink}" opacity="0.72">${label}</g>
${ticks(level.id, pad + labelW + gap, (H - 11) / 2, 11, ink)}
<g fill="${ink}">${digit}</g>
</svg>`;
}

/**
 * Inline chip with the level's name spelled out — for a first-contact audience the bare
 * number lacks a denominator. The name stays English (it is part of the mark, like "CC BY"),
 * so the number-only chip remains the universal default; this one is the self-explanatory option.
 */
function nameChip(level, theme) {
  const H = 24, ink = INK[theme], pad = 9, gap = 9;
  const LABEL = 'AI USAGE', ls = 9.5, tr = 0.75, ns = 13.5;
  const p = glyphPool(`aus-n${level.id}${theme[0]}-`);

  const labelW = advance('b', LABEL, ls, tr);
  const numW = advance('b', String(level.id), ns);
  const NAME = level.name.toUpperCase();
  const nameW = advance('b', NAME, ls, tr);
  const W = pad + labelW + gap + TICKS_W + gap + numW + 7 + nameW + pad;

  const label = p.run('b', LABEL, ls, pad, H / 2 + ls * 0.35, tr);
  const digitX = pad + labelW + gap + TICKS_W + gap;
  const digit = p.run('b', String(level.id), ns, digitX, H / 2 + ns * 0.36);
  const name = p.run('b', NAME, ls, digitX + numW + 7, H / 2 + ls * 0.35, tr);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${num(W)}" height="${H}" viewBox="0 0 ${num(W)} ${H}" role="img" aria-label="${esc(alt(level))}">
<title>${esc(alt(level))}</title>
${p.defs()}
<rect x="0.5" y="0.5" width="${num(W - 1)}" height="${H - 1}" fill="none" stroke="${ink}" stroke-opacity="0.55"/>
<g fill="${ink}" opacity="0.72">${label}</g>
${ticks(level.id, pad + labelW + gap, (H - 11) / 2, 11, ink)}
<g fill="${ink}">${digit}${name}</g>
</svg>`;
}

/** Display stamp — for a colophon, an about page, a poster. */
function stamp(level, theme) {
  const W = 300, H = 208, pad = 18, ink = INK[theme];
  const bodySize = 10;
  const p = glyphPool(`aus-s${level.id}${theme[0]}-`);

  const perLine = Math.floor((W - pad * 2) / charW('r', bodySize, 0));
  const lines = [];
  let cur = '';
  for (const word of level.oneLine.split(' ')) {
    if (cur && (cur + ' ' + word).length > perLine) { lines.push(cur); cur = word; }
    else cur = cur ? cur + ' ' + word : word;
  }
  if (cur) lines.push(cur);
  if (lines.length > 2) throw new Error(`Level ${level.id}: oneLine needs ${lines.length} lines, stamp fits 2.`);

  const eyebrow = p.run('b', 'AI USAGE SCALE', 9, pad, 30, 1.1);
  const numeral = p.run('b', String(level.id), 54, pad, 106);
  const nameX = pad + advance('b', String(level.id), 54) + 22;
  const name = p.run('b', level.name.toUpperCase(), 13, nameX, 106, 0.9);
  const body = lines.map((l, i) => p.run('r', l, bodySize, pad, 152 + i * 14)).join('');
  const url = p.run('r', `usagescale.org/${level.id}`, 8.5, pad, 190);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(alt(level))}">
<title>${esc(alt(level))}</title>
${p.defs()}
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="${ink}" stroke-opacity="0.5"/>
<g fill="${ink}" opacity="0.62">${eyebrow}</g>
${ticks(level.id, W - pad - TICKS_W, 21, 11, ink)}
<g fill="${ink}">${numeral}${name}</g>
<line x1="${pad}" y1="130" x2="${W - pad}" y2="130" stroke="${ink}" stroke-opacity="0.3"/>
<g fill="${ink}" opacity="0.7">${body}</g>
<g fill="${ink}" opacity="0.45">${url}</g>
</svg>`;
}

mkdirSync(OUT, { recursive: true });
let n = 0, bytes = 0;
const seenIds = new Map();
for (const level of levels) {
  for (const theme of ['light', 'dark', 'auto']) {
    const sfx = theme === 'light' ? '' : `-${theme}`;
    for (const [name, svg] of [
      [`${level.id}${sfx}.svg`, chip(level, theme)],
      [`${level.id}-name${sfx}.svg`, nameChip(level, theme)],
      [`${level.id}-stamp${sfx}.svg`, stamp(level, theme)],
    ]) {
      // A NaN here truncates text mid-glyph in every browser. Never ship one.
      if (/NaN|Infinity|undefined/.test(svg)) throw new Error(`${name} contains a non-finite value`);
      // Element ids are document-global. Two badges inlined on one page must not collide,
      // or every <use> in the second resolves against the first badge's defs.
      for (const id of svg.match(/id="([^"]+)"/g) ?? []) {
        const key = id.slice(4, -1);
        if (seenIds.has(key)) throw new Error(`${name}: id "${key}" already used by ${seenIds.get(key)} — inlining both on one page would corrupt it`);
        seenIds.set(key, name);
      }
      writeFileSync(join(OUT, name), svg);
      n++;
      bytes += svg.length;
    }
  }
}
console.log(`badges: ${n} SVGs → public/badge/ · avg ${Math.round(bytes / n / 1024 * 10) / 10} KB · validated`);
