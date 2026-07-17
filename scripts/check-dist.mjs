/**
 * Post-build gate. Runs against dist/ — the thing that actually ships.
 *
 * The unit tests guard the scale. This guards the promises the site makes to the outside
 * world: that a badge URL resolves without JavaScript, that it carries the declaration in
 * static HTML, that what we tell crawlers matches what we tell people, and that nothing on
 * the page phones home.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

let failed = 0;
const check = (name, fn) => {
  try { fn(); console.log(`  ✓ ${name}`); }
  catch (e) { console.error(`  ✗ ${name}\n      ${e.message}`); failed++; }
};
const ok = (v, msg) => { if (!v) throw new Error(msg); };

const read = (f) => readFileSync(join(DIST, f), 'utf8');
const PAGES = ['index', '0', '1', '2', '3', '4', '5', 'scale', 'find-your-level', 'badges', 'spec', 'sign', 'ecosystem', 'integrations', 'cases', 'eu-ai-act'];

console.log('\nWhat ships');

check('every page was built', () => {
  for (const p of PAGES) ok(existsSync(join(DIST, `${p}.html`)), `${p}.html is missing`);
});

check('the badge target pages carry the declaration in static HTML', () => {
  // No JavaScript. This is the promise a badge makes when someone pastes it into an
  // article: that in ten years the link still resolves to something a reader can read.
  for (const i of [0, 1, 2, 3, 4, 5]) {
    const h = read(`${i}.html`);
    // The page's OWN head declares the page's own authorship level — every page on the site
    // is a Level-3 work, so /5 must NOT announce ai-usage=5 ("published unreviewed"). The
    // level-i declaration people copy lives in the embed example in the body, not here.
    ok(/name="ai-usage" content="3"/.test(h), `/${i} should declare its own authorship level (3), not its subject level`);
    ok(/name="ai-usage-standard" content="https:\/\/usagescale\.org"/.test(h), `/${i} does not identify the proposed vocabulary`);
    ok(/name="ai-disclosure"/.test(h), `/${i} has no machine-readable declaration`);
    ok(/rel="ai-disclosure"/.test(h), `/${i} does not link its definition`);
    // The copy-paste embed still demonstrates level i — that is where the subject level belongs.
    ok(new RegExp(`ai-usage&quot; content=&quot;${i}`).test(h), `/${i} does not show a level-${i} embed example in the body`);
    ok(/<svg/.test(h), `/${i} has no inline mark`);
    ok(/Level \d/.test(h), `/${i} does not name its level in the body`);
  }
});

check('canonical, og:url and the sitemap all agree, and none of them says .html', () => {
  // build.format: 'file' makes Astro report /3.html. The badge points at /3. If those
  // ever disagree, every share and every crawl lands on the wrong address.
  for (const p of PAGES) {
    const h = read(`${p}.html`);
    const canon = h.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const og = h.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
    ok(canon, `${p} has no canonical`);
    ok(canon === og, `${p}: canonical ${canon} != og:url ${og}`);
    ok(!canon.includes('.html'), `${p}: canonical still has an extension — ${canon}`);
  }
  const sm = read('sitemap-0.xml');
  ok(!sm.includes('.html'), 'the sitemap advertises .html URLs');
  for (const i of [0, 1, 2, 3, 4, 5]) {
    ok(sm.includes(`<loc>https://usagescale.org/${i}</loc>`), `sitemap is missing /${i}`);
  }
});

check('every page has a social card, and the card exists', () => {
  for (const p of PAGES) {
    const img = read(`${p}.html`).match(/<meta property="og:image" content="[^"]*\/og\/([^"]+)\.png"/)?.[1];
    ok(img, `${p} has no og:image`);
    ok(existsSync(join(DIST, 'og', `${img}.png`)), `${p} points at og/${img}.png, which was not generated`);
  }
});

check('the levels are published as a controlled vocabulary', () => {
  const ld = JSON.parse(read('3.html').match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  const set = ld['@graph'].find((n) => n['@type'] === 'DefinedTermSet');
  ok(set, 'no DefinedTermSet in the graph');
  ok(set.hasDefinedTerm.length === 6, `expected 6 DefinedTerms, got ${set.hasDefinedTerm.length}`);
  ok(set.license.includes('publicdomain/zero'), 'the vocabulary is not published as CC0');
});

check('llms.txt and llms-full.txt carry the whole standard', () => {
  const short = read('llms.txt');
  const full = read('llms-full.txt');
  ok(short.startsWith('# AI Usage Scale'), 'llms.txt has no H1');
  ok(short.includes('> '), 'llms.txt has no summary blockquote (llmstxt.org format)');
  for (const l of ['Human', 'Assisted', 'Co-created', 'Directed', 'Prompted', 'Automated']) {
    ok(short.includes(l), `llms.txt omits level ${l}`);
    ok(full.includes(l), `llms-full.txt omits level ${l}`);
  }
  ok(full.includes('There is no shameful level'), 'llms-full.txt does not contain the manifesto');
  ok(short.includes('provenance signal, not training permission'), 'llms.txt confuses provenance with training permission');
  ok(full.includes('not a registered standard'), 'llms-full.txt presents proposed metadata as established');
  ok(full.length > 20000, `llms-full.txt is only ${full.length} bytes — the manifesto is probably missing`);
});

check('every language points at every other, and x-default at the source', () => {
  // Without reciprocal hreflang, each translation competes with the original for the same
  // query and all of them lose. Google drops non-reciprocal annotations entirely.
  const langs = readdirSync(join(ROOT, 'src', 'i18n')).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
  const h = read('3.html');
  for (const l of langs) {
    ok(new RegExp(`hreflang="${l}"`).test(h), `/3 does not link its ${l} translation`);
  }
  ok(/hreflang="x-default" href="https:\/\/usagescale\.org\/3"/.test(h), '/3 has no x-default pointing at the source');

  for (const l of langs.filter((x) => x !== 'en')) {
    const t = read(join(l, '3.html'));
    // Full mesh, not just a back-link to English: every translation must annotate every other,
    // plus x-default. A missing de↔fr pair would slip a one-directional "points back at en" check.
    for (const other of langs) {
      ok(new RegExp(`hreflang="${other}"`).test(t), `/${l}/3 does not link its ${other} translation`);
    }
    ok(/hreflang="x-default" href="https:\/\/usagescale\.org\/3"/.test(t), `/${l}/3 has no x-default`);
    ok(/<link rel="canonical" href="[^"]+"/.test(t), `/${l}/3 has no canonical`);
  }
});

check('every translation declares itself as one, on the page', () => {
  // The scale's own translation rule, applied to the scale. Twenty silent machine
  // translations of a transparency standard would discredit it on day one.
  const langs = readdirSync(join(ROOT, 'src', 'i18n')).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
  for (const l of langs.filter((x) => x !== 'en')) {
    const h = read(join(l, '3.html'));
    ok(/class="tn"/.test(h), `/${l}/3 does not carry a translation notice`);
  }
  ok(!/class="tn"/.test(read('3.html')), 'the English source should not claim to be a translation');
});

check('nothing on the site phones home', () => {
  // No analytics, no third-party fonts, no embeds. A standard about honesty does not
  // quietly watch the people who adopt it. Links *in prose* are fine — what must not
  // exist is a loaded subresource.
  const SUBRESOURCE = /<(?:script|iframe|video|audio|source)[^>]+\bsrc="([^"]+)"|<img[^>]+\bsrc="([^"]+)"|<link[^>]+rel="(?:stylesheet|preload|modulepreload|preconnect|dns-prefetch)"[^>]*\bhref="([^"]+)"/g;
  for (const p of PAGES) {
    const h = read(`${p}.html`);
    for (const m of h.matchAll(SUBRESOURCE)) {
      const u = m[1] ?? m[2] ?? m[3];
      ok(
        u.startsWith('/') || u.startsWith('data:') || u.startsWith('https://usagescale.org'),
        `${p} loads a third-party subresource: ${u}`
      );
    }
    // Match analytics *domains*, not bare words: a manifesto about honesty may legitimately
    // use the word "plausible" or "fathom" in prose, and that must not fail a deploy.
    ok(!/googletagmanager|google-analytics|plausible\.io|usefathom\.com|hotjar\.com|segment\.com/.test(h), `${p} contains an analytics tag`);
    ok(!/fonts\.googleapis|fonts\.gstatic/.test(h), `${p} fetches fonts from a third party`);
  }
});

check('the marks that ship contain no external reference', () => {
  for (const f of readdirSync(join(DIST, 'badge'))) {
    const s = read(join('badge', f));
    ok(!/<image|\bhref="https?:|url\(http|@import|font-family/.test(s), `${f} pulls in an external resource`);
  }
});

console.log(failed ? `\n${failed} failed\n` : '\nall passed\n');
process.exit(failed ? 1 : 0);
