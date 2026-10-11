import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const spec = JSON.parse(readFileSync(join(ROOT, 'spec/levels.json'), 'utf8'));
const langs = readdirSync(join(ROOT, 'src/i18n')).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
const pages = ['0', '1', '2', '3', '4', '5', 'scale', 'find-your-level', 'badges', 'spec', 'project', 'ecosystem', 'integrations', 'cases', 'eu-ai-act'];
const references = new Set(['project', 'ecosystem', 'integrations', 'cases', 'eu-ai-act']);
const files = langs.flatMap(lang => [lang === 'en' ? 'index.html' : lang + '.html', ...pages.map(p => (lang === 'en' ? '' : lang + '/') + p + '.html')]);
const read = file => readFileSync(join(DIST, file), 'utf8');
const ok = (value, message) => { if (!value) throw new Error(message); };
let failed = 0;
const check = (name, fn) => {
  try { fn(); console.log('  ✓ ' + name); }
  catch (error) { failed++; console.error('  ✗ ' + name + '\n      ' + error.message); }
};
const graph = html => JSON.parse(html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)[1])['@graph'];
const head = html => html.split('</head>')[0];

console.log('\nWhat ships');

check('all 352 pages exist and have one H1', () => {
  for (const file of files) {
    ok(existsSync(join(DIST, file)), file + ' missing');
    ok((read(file).match(/<h1\b/g) ?? []).length === 1, file + ': expected one H1');
  }
});
check('all homepages expose six definition links without JavaScript', () => {
  for (const lang of langs) {
    const html = read(lang === 'en' ? 'index.html' : lang + '.html');
    const prefix = lang === 'en' ? '' : '/' + lang;
    for (let i = 0; i < 6; i++) ok(html.includes('href="' + prefix + '/' + i + '" class="level-row"'), lang + ': missing level ' + i);
    ok(html.includes('dir="' + (['ar', 'fa'].includes(lang) ? 'rtl' : 'ltr') + '"'), lang + ': wrong direction');
  }
});
check('subject levels are examples, not unverified site declarations', () => {
  for (const file of files) {
    const html = read(file);
    ok(!/name="ai-usage" content="[0-5]"/.test(head(html)), file + ': assumed source level');
    ok(/name="ai-review-status" content="pending"/.test(head(html)), file + ': editorial status missing');
  }
  for (const level of spec.levels) {
    const html = read(level.id + '.html');
    ok(new RegExp('ai-usage&quot; content=&quot;' + level.id).test(html), '/' + level.id + ': missing embed');
    ok(html.includes('<svg'), '/' + level.id + ': missing SVG');
    ok(html.includes('https://usagescale.org/spec#aiUsageLevel'), '/' + level.id + ': extension IRI missing');
    ok(!html.includes('&quot;additionalProperty&quot;'), '/' + level.id + ': invalid CreativeWork mapping');
  }
});
check('canonical URLs, social cards and genuine translations agree', () => {
  const sitemap = read('sitemap-0.xml');
  ok(!sitemap.includes('.html'), 'sitemap contains file extensions');
  for (const file of files) {
    const html = read(file);
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
    const og = html.match(/property="og:url" content="([^"]+)"/)?.[1];
    ok(canonical && canonical === og && !canonical.includes('.html'), file + ': canonical mismatch');
    const card = html.match(/property="og:image" content="[^"]*\/og\/([^"]+)\.png"/)?.[1];
    ok(card && existsSync(join(DIST, 'og', card + '.png')), file + ': missing social card');
    const last = file.split('/').pop().replace('.html', '');
    if (references.has(last)) {
      ok(html.includes('<html lang="en" dir="ltr"'), file + ': English body mislabeled');
      ok(!/hreflang="pl"/.test(head(html)), file + ': fake translation');
      if (file.includes('/')) {
        ok(!sitemap.includes('<loc>https://usagescale.org/' + file.replace('.html', '') + '</loc>'), file + ': duplicate reference in sitemap');
        ok(html.includes('content="noindex, follow"'), file + ': duplicate not excluded');
      }
    } else {
      for (const lang of langs) ok(head(html).includes('hreflang="' + lang + '"'), file + ': missing ' + lang);
    }
  }
});
check('vocabulary markup reflects visible content and creates no fictitious organisation', () => {
  for (const file of files) {
    const nodes = graph(read(file));
    ok(!nodes.some(n => n['@type'] === 'Organization'), file + ': fictional organisation');
    for (const term of nodes.filter(n => n['@type'] === 'DefinedTerm')) ok(!('inLanguage' in term), file + ': unsupported DefinedTerm property');
  }
  for (const file of ['index.html', 'scale.html']) {
    const terms = graph(read(file)).find(n => n['@type'] === 'DefinedTermSet');
    ok(terms.hasDefinedTerm.length === 6, file + ': expected six visible terms');
    ok(terms.license.includes('publicdomain/zero'), file + ': wrong vocabulary licence');
  }
  const subject = graph(read('3.html')).find(n => n['@type'] === 'DefinedTerm');
  ok(subject.termCode === '3', '/3 subject missing');
});
check('translations show their production status without assuming a source level', () => {
  for (const lang of langs.filter(lang => lang !== 'en')) {
    const html = read(lang + '/3.html');
    ok(/class="tn"/.test(html), lang + ': missing translation notice');
    ok(head(html).includes('method=machine; review=unreviewed'), lang + ': wrong translation status');
    ok(!head(html).includes('source-level=3'), lang + ': assumed source level');
  }
});
check('both schemas accept valid data and reject inconsistent declarations', () => {
  const ajv = new Ajv({ allErrors: true, strictTypes: false });
  addFormats(ajv);
  const vocabulary = ajv.compile(JSON.parse(read('spec.schema.json')));
  const declaration = ajv.compile(JSON.parse(read('levels.schema.json')));
  ok(vocabulary(spec), 'canonical vocabulary: ' + JSON.stringify(vocabulary.errors));
  for (const lang of langs) ok(vocabulary(JSON.parse(read((lang === 'en' ? '' : lang + '/') + 'levels.json'))), lang + ': invalid vocabulary');
  for (const l of spec.levels) ok(declaration({ level: l.id, name: l.name, definition: 'https://usagescale.org/' + l.id }), 'valid level ' + l.id);
  ok(declaration({ level: 3, surfaces: { text: 3, image: 4 }, translation: { by: 'machine', review: 'unreviewed' } }), 'valid surfaces/translation');
  for (const bad of [{}, { level: '3' }, { level: 6 }, { level: -1 }, { level: 2.5 }, { level: 3, name: 'Human' }, { level: 3, definition: 'https://usagescale.org/4' }, { level: 1, surfaces: { text: 6 } }, { level: 1, surfaces: { unknown: 0 } }, { level: 3, translation: { by: 'machine' } }])
    ok(!declaration(bad), 'accepted bad declaration: ' + JSON.stringify(bad));
  const broken = structuredClone(spec);
  broken.levels[5].id = 4;
  ok(!vocabulary(broken), 'accepted duplicate level IDs');
});
check('text endpoints contain definitions, not obsolete promises or an unpublished package command', () => {
  const short = read('llms.txt'), full = read('llms-full.txt');
  ok(short.startsWith('# AI Usage Scale') && short.includes('> '), 'short index format');
  for (const l of spec.levels) {
    ok(short.includes(l.name) && full.includes(l.definition), 'text endpoints omit ' + l.name);
  }
  ok(full.includes('human review') && full.includes('not a registered'), 'status caveats missing');
  ok(!full.includes('There is no shameful level'), 'obsolete manifesto remains');
  ok(!read('integrations.html').includes('npx -y usagescale-mcp'), 'unpublished package advertised');
});
check('internal links and anchors resolve across all languages', () => {
  const cached = new Map();
  const resolve = path => {
    const relative = decodeURIComponent(path).replace(/^\//, '').replace(/\/$/, '');
    for (const file of [relative, relative + '.html', join(relative, 'index.html')]) {
      if (file && existsSync(join(DIST, file)) && !file.endsWith('/')) return file;
    }
    return relative === '' ? 'index.html' : null;
  };
  for (const file of files) {
    const html = read(file);
    for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      const href = match[1].replace(/&amp;/g, '&');
      if (!href.startsWith('/') && !href.startsWith('#')) continue;
      const url = new URL(href, 'https://usagescale.org/' + file.replace(/\.html$/, ''));
      const target = resolve(url.pathname);
      ok(target, file + ': missing link ' + href);
      if (url.hash && target.endsWith('.html')) {
        if (!cached.has(target)) cached.set(target, read(target));
        const id = decodeURIComponent(url.hash.slice(1));
        ok(cached.get(target).includes('id="' + id + '"'), file + ': missing anchor ' + href);
      }
    }
  }
});
check('retired signing URLs have redirects and no live signature page', () => {
  ok(!existsSync(join(DIST, 'sign.html')), 'sign page still built');
  const redirects = read('_redirects');
  for (const lang of langs) {
    const prefix = lang === 'en' ? '' : '/' + lang;
    ok(redirects.includes(prefix + '/sign ' + prefix + '/project 301'), lang + ': missing redirect');
  }
  ok(!existsSync(join(DIST, '.well-known/ai-disclosure.json')), 'unverified numeric self-declaration remains');
});
check('loaded resources stay local and the CSP covers the theme script', () => {
  const resource = /<(?:script|iframe|video|audio|source)[^>]+\bsrc="([^"]+)"|<img[^>]+\bsrc="([^"]+)"|<link[^>]+rel="(?:stylesheet|preload|modulepreload|preconnect|dns-prefetch)"[^>]*\bhref="([^"]+)"/g;
  for (const file of files) {
    const html = read(file);
    for (const match of html.matchAll(resource)) {
      const url = match[1] ?? match[2] ?? match[3];
      ok(url.startsWith('/') || url.startsWith('data:') || url.startsWith('https://usagescale.org'), file + ': external resource ' + url);
    }
    const csp = html.match(/http-equiv="content-security-policy"\s+content="([^"]*)"/i)?.[1];
    ok(csp?.includes("default-src 'self'") && csp.includes("connect-src 'none'"), file + ': weak CSP');
    const theme = [...html.matchAll(/<script(?![^>]*\btype=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('dataset.js'));
    const hash = 'sha256-' + createHash('sha256').update(theme ?? '', 'utf8').digest('base64');
    ok(csp.includes(hash), file + ': theme script hash missing');
  }
});

console.log(failed ? '\n' + failed + ' failed\n' : '\nall passed\n');
process.exit(failed ? 1 : 0);
