import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync } from 'node:fs';

const locales = Object.fromEntries(
  readdirSync('./src/i18n')
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''))
    .map((l) => [l, l])
);

export default defineConfig({
  site: 'https://usagescale.org',

  // Static HTML at every URL. A badge pasted into an article in 2026 must still resolve in
  // 2036 — in a screen reader, a scraper, an LLM, archive.org, and with JavaScript switched
  // off. An SPA would serve every one of those an empty div.
  output: 'static',

  // /3, not /3/ — the badge URL has to be short, and it has to stay short.
  build: { format: 'file' },

  i18n: {
    defaultLocale: 'en',
    locales: Object.keys(locales),
    routing: { prefixDefaultLocale: false }, // English lives at the root
  },

  integrations: [
    sitemap({
      // Tell search engines which pages are translations of each other. Without this each
      // translation competes with the original for the same query and all of them lose.
      i18n: { defaultLocale: 'en', locales },
      // build.format: 'file' makes Astro emit /3.html here too. The badge points at /3, and
      // a sitemap that advertises a different URL is a sitemap that splits the page.
      serialize: (item) => {
        const strip = (u) => u.replace(/index\.html$/, '').replace(/\.html$/, '');
        return {
          ...item,
          url: strip(item.url),
          // The i18n integration also emits hreflang alternates in item.links[]; those are built
          // from raw page URLs and bypass the url rewrite above, so without this every
          // <xhtml:link> would still advertise the .html form the <loc> just dropped.
          links: item.links?.map((l) => ({ ...l, url: strip(l.url) })),
        };
      },
    }),
  ],

  markdown: { shikiConfig: { theme: 'github-light' } },
});
