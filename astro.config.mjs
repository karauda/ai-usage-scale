import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync } from 'node:fs';

const locales = Object.fromEntries(
  readdirSync('./src/i18n')
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace('.json', ''))
    .map((lang) => [lang, lang])
);
const referencePages = new Set(['project', 'integrations', 'cases', 'eu-ai-act', 'ecosystem']);
const cleanURL = (url) => url.replace(/index\.html$/, '').replace(/\.html$/, '');
const isReference = (url) => referencePages.has(new URL(cleanURL(url)).pathname.split('/').pop());

export default defineConfig({
  site: 'https://usagescale.org',
  output: 'static',
  compressHTML: true,
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'none'",
        "base-uri 'none'",
        "form-action 'none'",
      ],
      scriptDirective: {
        // The inline first-paint theme script is not processed by Astro. Tests guard its hash.
        hashes: ['sha256-jfZ+wGdJDDwupnt/1WnWzJov/Ry8phZ4tFMotOgGBsQ='],
      },
    },
  },
  build: { format: 'file' },
  i18n: {
    defaultLocale: 'en',
    locales: Object.keys(locales),
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales },
      // Reference content is English; localised navigation does not make a translation.
      filter: (url) => !isReference(url) || new URL(cleanURL(url)).pathname.split('/').filter(Boolean).length === 1,
      serialize: (item) => ({
        ...item,
        url: cleanURL(item.url),
        links: isReference(item.url) ? undefined : item.links?.map((link) => ({ ...link, url: cleanURL(link.url) })),
      }),
    }),
  ],
});
