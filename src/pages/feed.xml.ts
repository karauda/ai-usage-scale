import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * RSS of the standard's version history.
 *
 * This feed is load-bearing, not decorative: a change to what a level *means* invalidates every
 * declaration already published against it. Registries, validators and agents that adopt the
 * scale need a machine-readable way to learn the moment it moves. Parsed from CHANGELOG.md so
 * the feed can never drift from the human record.
 */

const SITE = 'https://usagescale.org';
const changelog = readFileSync(fileURLToPath(new URL('../../CHANGELOG.md', import.meta.url)), 'utf8');

function releases() {
  const re = /^## \[([^\]]+)\][^\n]*?(\d{4}-\d{2}-\d{2})/gm;
  const heads = [...changelog.matchAll(re)];
  return heads
    .map((m, i) => {
      const start = (m.index ?? 0) + m[0].length;
      const end = i + 1 < heads.length ? (heads[i + 1].index ?? changelog.length) : changelog.length;
      return { version: m[1], date: m[2], body: changelog.slice(start, end).trim() };
    })
    // Newest first, by date — never trust the CHANGELOG to be ordered. ISO dates sort as strings.
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

const rfc822 = (d: string) => new Date(`${d}T00:00:00Z`).toUTCString();
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The changelog body is Markdown bullets. Render them as a real list so a feed reader shows
 *  structure, not a wall of literal "**" and "-". Wrapped in CDATA, so the tags reach the reader. */
function bodyHtml(md: string) {
  const items: string[] = [];
  for (const raw of md.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('- ')) items.push(line.slice(2));
    else if (items.length) items[items.length - 1] += ' ' + line; // wrapped continuation
    else items.push(line);
  }
  const inline = (t: string) =>
    esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code>$1</code>');
  return `<ul>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</ul>`;
}

export const GET: APIRoute = () => {
  const items = releases();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Usage Scale — releases</title>
    <link>${SITE}</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Version history of the AI Usage Scale. A change to what a level means invalidates declarations already made against it — this feed exists so the tools and registries that adopt the scale know the moment it moves.</description>
    <language>en</language>
    <lastBuildDate>${items[0] ? rfc822(items[0].date) : new Date().toUTCString()}</lastBuildDate>
${items
  .map(
    (r) => `    <item>
      <title>${esc(r.version)}</title>
      <link>${SITE}/spec</link>
      <guid isPermaLink="false">usagescale-${esc(r.version)}</guid>
      <pubDate>${rfc822(r.date)}</pubDate>
      <description><![CDATA[${bodyHtml(r.body)}]]></description>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
