import type { APIRoute } from 'astro';
import spec from '../../../spec/levels.json';
import { LANGS, DEFAULT_LANG, getLocale, levelsIn, treeIn, edgeCasesIn } from '../../lib/i18n';

export const getStaticPaths = () =>
  LANGS.map((lang) => ({ params: { lang: lang === DEFAULT_LANG ? undefined : lang }, props: { lang } }));

/** The canonical definition, in one language. CC0. Everything else derives from it. */
export const GET: APIRoute = ({ props }) => {
  const lang = (props as { lang: string }).lang;
  const t = getLocale(lang);

  const body = {
    ...spec,
    lang,
    translation: t.translation,
    principle: t.principle,
    axis: t.axis,
    surfaces: { ...spec.surfaces, note: t.surfaces.note, headlineRule: t.surfaces.headlineRule },
    levels: levelsIn(lang),
    decisionTree: treeIn(lang),
    edgeCases: edgeCasesIn(lang),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=3600',
    },
  });
};
