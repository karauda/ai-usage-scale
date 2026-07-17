import spec from '../../spec/levels.json';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface Level {
  id: number;
  key: string;
  name: string;
  oneLine: string;
  definition: string;
  note?: string;
  includes: string[];
  excludes: string[];
  examples: string[];
  sentences: { short: string; medium: string; long: string };
  mappings: {
    w3cAiDisclosure: string;
    iptcDigitalSourceType: string;
    iptcNote?: string;
    schemaOrgAiUsageLevel: number;
  };
}

export const LEVELS = spec.levels as Level[];
export const TREE = spec.decisionTree;
export const EDGE_CASES = spec.edgeCases;
export const INTEROP = spec.interop;
export const PRIOR_ART = spec.priorArt;
export const SURFACES = spec.surfaces;
export const PRINCIPLE = spec.principle;
export const AXIS = spec.axis;
export const VERSION = spec.version;

export const byId = (id: number) => {
  const l = LEVELS.find((x) => x.id === id);
  if (!l) throw new Error(`byId: no level with id ${id} (levels are 0–5)`);
  return l;
};

/**
 * Inline the badge SVG rather than linking it.
 *
 * A hotlinked badge is a tracking pixel on somebody else's page: it tells us every
 * time their reader loads their article. A standard whose subject is honesty cannot
 * ship one. The CDN copy stays available for people who want the convenience, but
 * copy-paste inline is the default we recommend.
 */
export function badgeSvg(
  id: number,
  variant: 'chip' | 'name' | 'stamp' = 'chip',
  /** `auto` inherits the host page's text colour (currentColor) — the right choice for inlining. */
  theme: 'light' | 'dark' | 'auto' = 'light',
  /** Localised description. The mark's glyphs stay English; what a screen reader says must not. */
  alt?: string
): string {
  const name = `${id}${variant === 'chip' ? '' : `-${variant}`}${theme === 'light' ? '' : `-${theme}`}.svg`;
  const path = fileURLToPath(new URL(`../../public/badge/${name}`, import.meta.url));
  const svg = readFileSync(path, 'utf8');
  if (!alt) return svg;

  // The mark itself is the standard's name — "AI USAGE 3", the way "CC BY" is Creative
  // Commons'. But a blind reader in Cairo should not have an English sentence read to them
  // because the picture happens to be in English. The visible mark is invariant; the text
  // alternative is not.
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // Function replacers: a literal string replacement would interpret `$` in the alt text
  // (`$&`, `$1`, a currency example…) as a capture-group reference and corrupt the output.
  const label = esc(alt);
  return svg
    .replace(/aria-label="[^"]*"/, () => `aria-label="${label}"`)
    .replace(/<title>[^<]*<\/title>/, () => `<title>${label}</title>`);
}

/**
 * The text alternative a screen reader speaks for a mark. "AI Usage Scale" is the invariant
 * name (like "CC BY"); the level word and the description are localised, so a reader on a
 * translated page is not read an English sentence. Single source of truth for every surface
 * that needs this string — page marks, the copy-paste embed, and the generated SVGs.
 */
export function levelAlt(
  level: { id: number; name: string; oneLine: string },
  /** Localised "Level {n}" template, e.g. ui.hero.levelHead. Defaults to English. */
  levelHead = 'Level {n}'
): string {
  return `AI Usage Scale: ${levelHead.replace('{n}', String(level.id))} — ${level.name}. ${level.oneLine}`;
}

/**
 * A mark for DISPLAY on our own themed pages: the `auto` build, whose ink is currentColor,
 * so it follows the resolved theme with no CSS swapping. The fixed-ink light/dark files stay
 * available for contexts (like a hosted <img>) where currentColor cannot inherit.
 */
export function adaptiveMark(id: number, variant: 'chip' | 'name' | 'stamp', alt?: string): string {
  return badgeSvg(id, variant, 'auto', alt);
}

/** The intrinsic pixel size of a generated mark, read from the file so it can never drift. */
export function markSize(id: number, variant: 'chip' | 'name' | 'stamp' = 'chip'): { w: number; h: number } {
  const svg = badgeSvg(id, variant);
  const w = svg.match(/\bwidth="([\d.]+)"/)?.[1];
  const h = svg.match(/\bheight="([\d.]+)"/)?.[1];
  if (!w || !h) throw new Error(`markSize: badge ${id}/${variant} declares no dimensions`);
  return { w: Number(w), h: Number(h) };
}

/** The HTML a creator copies into their page. */
export function embedHtml(id: number): string {
  const l = byId(id);
  const { w, h } = markSize(id);
  return `<a href="https://usagescale.org/${id}"
   rel="ai-disclosure"
   title="${l.sentences.medium}">
  <img src="https://usagescale.org/badge/${id}.svg"
       alt="${levelAlt(l)}"
       width="${Math.round(w)}" height="${h}">
</a>`;
}

/** The metadata that lets machines read the same declaration. */
export function embedMeta(id: number): string {
  const l = byId(id);
  return `<!-- AI Usage Scale proposal; custom metadata, not a registered standard -->
<meta name="ai-usage" content="${id}">
<meta name="ai-usage-standard" content="https://usagescale.org">

<!-- Experimental syntax aligned with discussions in the W3C AI Content Disclosure Community Group; not a W3C standard -->
<meta name="ai-disclosure" content="${l.mappings.w3cAiDisclosure}">

<!-- AI Usage Scale -->
<link rel="ai-disclosure" href="https://usagescale.org/${id}">

<!-- schema.org -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "additionalProperty": {
    "@type": "PropertyValue",
    "propertyID": "https://usagescale.org/spec#aiUsageLevel",
    "name": "aiUsageLevel",
    "value": ${id}
  }
}
</script>`;
}
