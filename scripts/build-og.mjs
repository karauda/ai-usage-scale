/**
 * Social cards — 1200 × 630, one per page.
 *
 * These are the only version of this argument most people will ever see: a card in a
 * timeline, at a glance, at speed. So the card carries the thesis, not a logo.
 *
 * Same rules as the marks. Type is outlined (so the rasteriser needs no fonts, and the
 * result is identical everywhere), and all six levels are printed in one ink — a card
 * that coloured Level 5 red would do the shaming the standard exists to stop.
 */
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, INK, PAPER, ACCENT, glyphPool, measure, wrap, num, assertClean } from './lib/type.mjs';

const OUT = join(ROOT, 'public', 'og');
const { levels } = JSON.parse(readFileSync(join(ROOT, 'spec', 'levels.json'), 'utf8'));

const W = 1200, H = 630, PAD = 72;
const ink = INK.light, paper = PAPER.light, accent = ACCENT.light;

/**
 * The scale strip along the foot of every card. Six cells; the card's own level is the
 * filled one. On the manifesto card nothing is filled — that is the point of the page.
 */
function strip(p, active) {
  const y = H - PAD - 92;
  const cw = (W - PAD * 2) / 6;
  let svg = `<rect x="${PAD}" y="${y}" width="${W - PAD * 2}" height="92" fill="none" stroke="${ink}" stroke-opacity="0.28"/>`;
  for (let i = 0; i <= 5; i++) {
    const x = PAD + i * cw;
    const on = i === active;
    if (on) svg += `<rect x="${num(x)}" y="${y}" width="${num(cw)}" height="92" fill="${ink}"/>`;
    if (i > 0) svg += `<line x1="${num(x)}" y1="${y}" x2="${num(x)}" y2="${y + 92}" stroke="${ink}" stroke-opacity="0.28"/>`;

    const fg = on ? paper : ink;
    const nSize = 30, name = levels[i].name.toUpperCase(), nmSize = 11;
    const nx = x + (cw - measure('M', String(i), nSize)) / 2;
    const mx = x + (cw - measure('M', name, nmSize, 1)) / 2;
    svg += `<g fill="${fg}">${p.run('M', String(i), nSize, nx, y + 44)}</g>`;
    svg += `<g fill="${fg}" opacity="${on ? 0.75 : 0.5}">${p.run('M', name, nmSize, mx, y + 68, 1)}</g>`;
  }
  return svg;
}

function card({ eyebrow, headline, sub, active, serif = true }) {
  const p = glyphPool('og-');
  const maxW = W - PAD * 2;

  const eb = p.run('M', eyebrow.toUpperCase(), 15, PAD, PAD + 16, 2.2);

  // The human voice is set in Spectral; the machine layer in Plex Mono. On a card that
  // has one second to land, that distinction has to survive at a glance.
  const hFont = serif ? 'S' : 'M';
  const hSize = serif ? 62 : 46;
  const hLines = wrap(hFont, headline, hSize, maxW);
  let head = '';
  hLines.forEach((l, i) => (head += p.run(hFont, l, hSize, PAD, PAD + 110 + i * (hSize * 1.18))));

  const subY = PAD + 110 + hLines.length * (hSize * 1.18) + 30;
  const sLines = sub ? wrap('s', sub, 26, maxW) : [];
  let subSvg = '';
  sLines.forEach((l, i) => (subSvg += p.run('s', l, 26, PAD, subY + i * 38)));

  const rule = `<line x1="${PAD}" y1="${PAD + 44}" x2="${W - PAD}" y2="${PAD + 44}" stroke="${ink}" stroke-opacity="0.2"/>`;

  // Every glyph must be registered before defs() is read. Template literals evaluate
  // left to right, so an inline `${strip(p)}` after `${p.defs()}` would emit <use>
  // references to ids that were never defined — and the strip silently renders empty.
  const foot = strip(p, active);
  const defs = p.defs();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${paper}"/>
${defs}
<g fill="${accent}">${eb}</g>
${rule}
<g fill="${ink}">${head}</g>
<g fill="${ink}" opacity="0.62">${subSvg}</g>
${foot}
</svg>`;

  assertClean(svg, 'og card');
  // A <use> pointing at an id that does not exist renders nothing, silently.
  for (const m of svg.matchAll(/href="#([^"]+)"/g)) {
    if (!svg.includes(`id="${m[1]}"`)) throw new Error(`og card: <use> references undefined glyph ${m[1]}`);
  }
  return svg;
}

mkdirSync(OUT, { recursive: true });

const render = (name, svg) => {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
  writeFileSync(join(OUT, `${name}.png`), png);
  return png.length;
};

let total = 0;

// The manifesto. No level is filled — the whole page argues that the label needs six.
total += render(
  'default',
  card({
    eyebrow: 'AI Usage Scale · An open standard',
    headline: 'There is no shameful level. There is only an undeclared one.',
    sub: 'A free, six-level scale for declaring how a work was made — whose knowledge it carries, and who stands behind it.',
    active: -1,
  })
);

for (const l of levels) {
  total += render(
    String(l.id),
    card({
      eyebrow: `AI Usage Scale · Level ${l.id} of 0–5`,
      headline: l.name,
      sub: l.oneLine,
      active: l.id,
    })
  );
}

total += render(
  'scale',
  card({
    eyebrow: 'AI Usage Scale · The six levels',
    headline: 'Six levels, and none of them is a verdict.',
    sub: 'Level 5 is honest for an automated market report. Level 0 is honest for a memoir. Neither outranks the other.',
    active: -1,
  })
);

total += render(
  'find-your-level',
  card({
    eyebrow: 'AI Usage Scale · Five questions',
    headline: 'What did you actually do?',
    sub: 'Five yes/no questions. Thirty seconds. You get a number, a mark, and a sentence you can paste anywhere.',
    active: -1,
  })
);

total += render(
  'spec',
  card({
    eyebrow: 'AI Usage Scale · Specification',
    headline: 'Provenance can be proven. Contribution can only be declared.',
    sub: 'Maps to IPTC and complements C2PA. Experimental ai-disclosure metadata is clearly marked as non-standard.',
    active: -1,
  })
);

const cardCount = readdirSync(OUT).filter((f) => f.endsWith('.png')).length;
console.log(`og: ${cardCount} cards → public/og/ · ${Math.round(total / 1024)} KB total`);
