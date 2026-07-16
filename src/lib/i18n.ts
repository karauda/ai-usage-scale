import spec from '../../spec/levels.json';

/**
 * The standard, in every language that matters.
 *
 * Two rules govern this:
 *
 *  1. **The mark itself stays in English.** "AI USAGE 3" is the standard's name, the way
 *     "CC BY" is Creative Commons' name — it is not translated into "CC UZ" in Polish, and
 *     for the same reason: a mark that changes shape per language stops being one mark.
 *     Everything *around* it translates, including the alt text a screen reader speaks.
 *
 *  2. **Every translation declares its own level.** Under this scale's own translation rule
 *     a faithful translation inherits the source's level and adds a translation note. So a
 *     machine translation of this site says, on the page, that it is a machine translation.
 *     A standard that would not apply its own rule to itself is not a standard.
 */

export interface Locale {
  lang: string;
  name: string;
  endonym: string;
  dir: 'ltr' | 'rtl';
  translation: null | { by: 'machine' | 'human'; reviewer?: string };
  principle: string;
  axis: { measures: string; doesNotMeasure: string };
  surfaces: { note: string; headlineRule: string };
  levels: Array<{
    id: number;
    name: string;
    oneLine: string;
    definition: string;
    note?: string;
    includes: string[];
    excludes: string[];
    examples: string[];
    sentences: { short: string; medium: string; long: string };
  }>;
  tree: Array<{ question: string; help: string }>;
  edgeCases: Array<{ case: string; rule: string; why?: string }>;
  ui: any;
}

const files = import.meta.glob<{ default: Locale }>('../i18n/*.json', { eager: true });

export const LOCALES: Record<string, Locale> = Object.fromEntries(
  Object.entries(files).map(([path, mod]) => [path.match(/([\w-]+)\.json$/)![1], mod.default])
);

export const DEFAULT_LANG = 'en';

/** Source first, then by endonym, so the switcher reads as a list rather than a ranking. */
export const LANGS = Object.keys(LOCALES).sort((a, b) =>
  a === DEFAULT_LANG ? -1 : b === DEFAULT_LANG ? 1 : LOCALES[a].endonym.localeCompare(LOCALES[b].endonym)
);

export const getLocale = (lang?: string): Locale => LOCALES[lang ?? DEFAULT_LANG] ?? LOCALES[DEFAULT_LANG];

/** English lives at the root. `/3` is short, and it has to stay short — it is a badge URL. */
export const localePath = (lang: string | undefined, path = '/'): string => {
  const clean = path === '/' ? '' : path.replace(/^\//, '');
  const prefix = !lang || lang === DEFAULT_LANG ? '' : `/${lang}`;
  return `${prefix}/${clean}`.replace(/\/$/, '') || '/';
};

/** One entry per locale. `undefined` for English, so it builds to the root. */
export const localeParams = () =>
  LANGS.map((lang) => ({ params: { lang: lang === DEFAULT_LANG ? undefined : lang }, props: { lang } }));

/**
 * Interpolate {n}, {name}, {total}. Deliberately not a template engine: a translator who
 * drops a placeholder should see the placeholder, not a crash or a silent blank.
 */
export const fmt = (s: string, vars: Record<string, string | number> = {}) =>
  (s ?? '').replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

// Every *In() helper degrades to the English canon rather than crashing or mislabelling when a
// contributor ships an incomplete locale — match by id/index, never by position, and tolerate a
// missing array. This is a public repo; a half-finished translation must not break the build.

/** Level content in `lang`, with the mappings and ids from the canonical spec. */
export function levelsIn(lang?: string) {
  const loc = getLocale(lang);
  const locLevels = loc.levels ?? [];
  return spec.levels.map((canon) => {
    // Match by id only. A positional fallback (loc.levels[canon.id]) would render a *different*
    // level's translated text if a locale omits or reorders a level; falling to canon is honest.
    const t = locLevels.find((l) => l.id === canon.id);
    return { ...canon, ...t, mappings: canon.mappings };
  });
}

export function treeIn(lang?: string) {
  const loc = getLocale(lang);
  const locTree = loc.tree ?? [];
  return spec.decisionTree.map((canon, i) => ({ ...canon, ...(locTree[i] ?? {}) }));
}

/** Stable English slug — a deep-link like /spec#translation must resolve on every locale, so
 *  the id cannot come from the localized title (non-Latin titles collapse to an empty string). */
const anchorSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function edgeCasesIn(lang?: string) {
  const loc = getLocale(lang);
  const locCases = loc.edgeCases ?? [];
  const seen = new Set<string>();
  return spec.edgeCases.map((canon, i) => {
    // Disambiguate on collision, or two titles that slugify alike would both claim the same id.
    let anchor = anchorSlug(canon.case);
    while (seen.has(anchor)) anchor = `${anchor}-${i}`;
    seen.add(anchor);
    return { ...canon, ...(locCases[i] ?? {}), anchor };
  });
}

/** hreflang set for a path, so search engines serve the right language and no page competes with its own translation. */
export const alternates = (path: string) =>
  LANGS.map((lang) => ({
    lang,
    href: `https://usagescale.org${localePath(lang, path)}`,
  }));
