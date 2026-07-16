/**
 * Shared type machinery for the marks and the social cards.
 *
 * Both outline their type rather than setting it. For the marks that is a hard
 * requirement — a badge gets pasted onto a stranger's site where our fonts do not exist,
 * and it must not phone home to fetch them. For the social cards it means the rasteriser
 * needs no font configuration at all.
 *
 * opentype's own toPathData() emits `NaN` for some coordinates (its rounding helper does
 * Math.round(x + 'e+2'), which breaks on certain floats). One NaN makes a browser abandon
 * the path mid-glyph, so the text silently truncates. We serialise the command list
 * ourselves, and every caller asserts the output is clean.
 */
import pkg from 'opentype.js';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const { parse } = pkg;
export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const load = (f) => {
  const b = readFileSync(join(ROOT, 'src', 'fonts', f));
  return parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};

/** m = machine layer (IBM Plex Mono) · s = human voice (Spectral). The split is the argument. */
export const FONTS = {
  m: load('IBMPlexMono-Regular.ttf'),
  M: load('IBMPlexMono-SemiBold.ttf'),
  s: load('Spectral-Regular.ttf'),
  S: load('Spectral-SemiBold.ttf'),
};

export const INK = { light: '#16191B', dark: '#ECEEE9' };
export const PAPER = { light: '#F0F2ED', dark: '#16191B' };
export const ACCENT = { light: '#0D4F45', dark: '#6FC0AC' };

export const num = (v, dp = 1) => {
  const f = 10 ** dp;
  const r = Math.round(v * f) / f;
  if (!Number.isFinite(r)) throw new Error(`non-finite coordinate: ${v}`);
  return String(r);
};

export function serialise(path) {
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

export const advanceOf = (fontKey, ch, size) =>
  (FONTS[fontKey].charToGlyph(ch).advanceWidth / FONTS[fontKey].unitsPerEm) * size;

export const measure = (fontKey, text, size, tracking = 0) =>
  [...text].reduce((w, ch) => w + advanceOf(fontKey, ch, size) + tracking, 0) - tracking;

/**
 * Collects each distinct (font, char, size) once and hands back <use> references.
 *
 * `prefix` must be unique per document. Element ids are global to the *document*, so
 * when several marks are inlined on one page — which is exactly how we recommend using
 * them — a shared id like "g0" makes every <use> in every later mark resolve against the
 * first one's defs. The visible result is six marks all rendering level 0's glyphs.
 */
export function glyphPool(prefix) {
  const defs = new Map();
  return {
    run(fontKey, text, size, x, y, tracking = 0) {
      let cursor = x;
      let out = '';
      for (const ch of text) {
        const key = `${fontKey}-${size}-${ch.codePointAt(0)}`;
        if (!defs.has(key)) {
          const d = serialise(FONTS[fontKey].charToGlyph(ch).getPath(0, 0, size));
          defs.set(key, d ? { id: `${prefix}${defs.size.toString(36)}`, d } : null);
        }
        const g = defs.get(key);
        if (g) out += `<use href="#${g.id}" x="${num(cursor)}" y="${num(y)}"/>`;
        cursor += advanceOf(fontKey, ch, size) + tracking;
      }
      return out;
    },
    defs() {
      const es = [...defs.values()].filter(Boolean);
      return es.length ? `<defs>${es.map((g) => `<path id="${g.id}" d="${g.d}"/>`).join('')}</defs>` : '';
    },
  };
}

/** Greedy wrap by measured width, not by character count. */
export function wrap(fontKey, text, size, maxWidth, tracking = 0) {
  const lines = [];
  let cur = '';
  for (const word of text.split(' ')) {
    const next = cur ? `${cur} ${word}` : word;
    if (cur && measure(fontKey, next, size, tracking) > maxWidth) {
      lines.push(cur);
      cur = word;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Six marks, one filled. A position on a scale, never a quantity in a tank. */
export function ticks(level, x, y, h, ink, w = 2.5, gap = 2.5) {
  let svg = '';
  for (let i = 0; i <= 5; i++) {
    const on = i === level;
    const th = on ? h : h * 0.42;
    svg += `<rect x="${num(x + i * (w + gap))}" y="${num(y + (h - th) / 2)}" width="${w}" height="${num(th)}" fill="${ink}" opacity="${on ? 1 : 0.3}"/>`;
  }
  return svg;
}
export const ticksWidth = (w = 2.5, gap = 2.5) => 6 * w + 5 * gap;

export const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const assertClean = (svg, name) => {
  if (/NaN|Infinity|undefined/.test(svg)) throw new Error(`${name} contains a non-finite value`);
};
