import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve('dist');
assert.ok(existsSync(join(root, 'index.html')), 'Build the site before running browser checks.');
const output = process.env.BROWSER_REPORT_DIR || '/tmp/ai-usage-scale-preview';
mkdirSync(output, { recursive: true });
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml' };
const server = createServer((request, response) => {
  const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replace(/^\//, '');
  const target = [resolve(root, path), resolve(root, path + '.html'), resolve(root, path, 'index.html')]
    .find(file => file.startsWith(root + '/') && existsSync(file) && statSync(file).isFile());
  if (!target) { response.writeHead(404); response.end('Not found'); return; }
  response.setHeader('Content-Type', (mime[extname(target)] || 'text/plain') + (['.html', '.css', '.js', '.json', '.xml'].includes(extname(target)) ? '; charset=utf-8' : ''));
  response.end(readFileSync(target));
});
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
const origin = 'http://127.0.0.1:' + server.address().port;
let browser;
const errors = [];
const checks = [];
const check = async (name, fn) => { await fn(); checks.push(name); console.log('  ✓ ' + name); };
try {
  browser = await chromium.launch({ ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}), headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const external = [];
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.origin !== origin && url.protocol !== 'data:') external.push(request.url());
  });
  const locales = readdirSync('src/i18n').filter(file => file.endsWith('.json')).map(file => file.replace('.json', ''));

  await check('22 homepages fit desktop, tablet and 320px mobile viewports', async () => {
    for (const width of [1440, 768, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const lang of locales) {
        await page.goto(origin + (lang === 'en' ? '/' : '/' + lang));
        await page.evaluate(() => document.fonts.ready);
        const metrics = await page.evaluate(() => ({
          width: document.documentElement.clientWidth,
          scroll: document.documentElement.scrollWidth,
          rows: document.querySelectorAll('.level-row').length,
          direction: document.documentElement.dir,
        }));
        if (metrics.scroll > metrics.width + 1) {
          await page.screenshot({ path: join(output, 'overflow-' + lang + '-' + width + '.png'), fullPage: true });
          const offenders = await page.evaluate(() => [...document.querySelectorAll('body *')].map(el => ({
            tag: el.tagName, class: el.className?.baseVal ?? el.className,
            text: el.textContent?.slice(0, 70), right: el.getBoundingClientRect().right,
          })).filter(el => el.right > document.documentElement.clientWidth + 1).slice(0, 20));
          console.error(JSON.stringify(offenders, null, 2));
        }
        assert.ok(metrics.scroll <= metrics.width + 1, lang + ' at ' + width + 'px overflows by ' + (metrics.scroll - metrics.width));
        assert.equal(metrics.rows, 6);
        assert.equal(metrics.direction, ['ar', 'fa'].includes(lang) ? 'rtl' : 'ltr');
        if (lang === 'en') {
          const lines = await page.evaluate(() => {
            const text = document.querySelector('#hero-h').firstChild;
            const word = 'understandable.';
            const start = text.textContent.indexOf(word);
            const range = document.createRange();
            range.setStart(text, start);
            range.setEnd(text, start + word.length);
            return [...range.getClientRects()].filter(rect => rect.width > 0).length;
          });
          assert.equal(lines, 1, 'English headline splits a word at ' + width + 'px');
        }
      }
    }
  });
  await check('reference routes fit 320px and 1440px', async () => {
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of ['/scale', '/find-your-level', '/badges', '/spec', '/project', '/cases', '/integrations', '/eu-ai-act', '/ecosystem', '/0', '/1', '/2', '/3', '/4', '/5', '/pl/spec', '/ar/3']) {
        await page.goto(origin + route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        assert.ok(overflow <= 1, route + ' at ' + width + 'px overflows by ' + overflow);
      }
    }
  });
  await check('skip link, language menu, theme and clipboard operate with keyboard support', async () => {
    await page.goto(origin);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'main');
    await page.locator('details.lang summary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('details.lang').getAttribute('open'), '');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('details.lang').getAttribute('open'), null);
    await page.locator('[data-theme-toggle]').click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.locator('[data-theme-toggle]').click();
    await page.locator('[data-copy]').first().click();
    assert.match(await page.evaluate(() => navigator.clipboard.readText()), /AI Usage Scale/);
    assert.equal(await page.locator('.sr-status').first().textContent(), 'Copied');
    await page.goto(origin + '/3');
    const svgCode = page.locator('details.collapsible').first();
    assert.equal(await svgCode.locator('pre').isVisible(), false);
    await svgCode.locator('summary').click();
    assert.ok(await svgCode.locator('pre').isVisible());
    await svgCode.locator('[data-copy]').click();
    assert.match(await page.evaluate(() => navigator.clipboard.readText()), /<svg/);
  });
  await check('wizard resolves all 32 paths, exposes the review caveat, and supports restart/back/shared results', async () => {
    const spec = JSON.parse(readFileSync('spec/levels.json', 'utf8'));
    for (let bits = 0; bits < 32; bits++) {
      await page.goto(origin + '/find-your-level');
      await page.locator('[data-stepper]').waitFor({ state: 'visible' });
      const answers = [0, 1, 2, 3, 4].map(i => Boolean(bits & (1 << i)));
      let wanted;
      for (let i = 0; i < 5; i++) {
        await page.locator('[data-answer="' + (answers[i] ? 'yes' : 'no') + '"]').click();
        const outcome = spec.decisionTree[i][answers[i] ? 'yes' : 'no'];
        if (typeof outcome === 'number') { wanted = outcome; break; }
      }
      assert.equal(await page.locator('[data-result]:visible').getAttribute('data-result'), String(wanted));
      assert.equal(await page.evaluate(() => document.activeElement.className), 'r-name');
      if (wanted === 3) assert.ok(await page.locator('[data-result="3"] .review-caveat').isVisible());
    }
    await page.locator('[data-result]:visible [data-restart]').click();
    await page.locator('[data-answer="yes"]').click();
    await page.locator('[data-back]').click();
    assert.match(await page.locator('[data-count]').textContent(), /Question 1/);
    await page.goto(origin + '/find-your-level#level-3');
    await page.locator('[data-result="3"]').waitFor({ state: 'visible' });
    assert.ok(await page.locator('[data-result="3"]').isVisible());
    await page.locator('[data-result="3"] [data-copy]').click();
    assert.match(await page.evaluate(() => navigator.clipboard.readText()), /Level 3 on the AI Usage Scale/);
  });
  await check('WCAG A/AA automated checks pass for core pages, RTL and both themes', async () => {
    for (const route of ['/', '/pl', '/ar', '/zh', '/find-your-level', '/pl/find-your-level', '/0', '/1', '/2', '/3', '/4', '/5', '/scale', '/spec', '/badges', '/project', '/cases', '/integrations', '/eu-ai-act', '/ecosystem']) {
      await page.goto(origin + route);
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      assert.equal(result.violations.length, 0, route + ': ' + JSON.stringify(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))));
    }
    await page.goto(origin);
    await page.locator('[data-theme-toggle]').click();
    const dark = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.equal(dark.violations.length, 0, 'dark: ' + JSON.stringify(dark.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))));
  });
  await check('definitions, language switching and decision procedure work without JavaScript', async () => {
    const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 900 } });
    const fallback = await noJS.newPage();
    for (const route of ['/', '/pl', '/ar']) {
      await fallback.goto(origin + route);
      assert.equal(await fallback.locator('.level-row').count(), 6);
      await fallback.locator('details.lang summary').click();
      assert.ok(await fallback.locator('details.lang a[hreflang="en"]').isVisible());
    }
    await fallback.goto(origin + '/find-your-level');
    assert.ok(await fallback.locator('[data-tree-static]').isVisible());
    assert.equal(await fallback.locator('[data-tree-static] li').count(), 5);
    assert.equal(await fallback.locator('[data-stepper]').isVisible(), false);
    await fallback.goto(origin + '/3');
    const svgCode = fallback.locator('details.collapsible').first();
    await svgCode.locator('summary').click();
    assert.ok(await svgCode.locator('pre').isVisible());
    await noJS.close();
  });
  await check('screenshots and browser report are saved', async () => {
    await page.evaluate(() => localStorage.removeItem('theme'));
    for (const [name, route, width] of [['en-desktop', '/', 1440], ['pl-desktop', '/pl', 1440], ['pl-mobile', '/pl', 375], ['ar-mobile', '/ar', 375], ['zh-mobile', '/zh', 375], ['level-3', '/3', 1440]]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(origin + route);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: join(output, name + '.png'), fullPage: true });
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(origin);
    await page.locator('[data-theme-toggle]').click();
    await page.screenshot({ path: join(output, 'en-dark.png'), fullPage: true });
  });
  assert.deepEqual(errors, [], 'Browser/CSP errors: ' + errors.join('\n'));
  assert.deepEqual(external, [], 'External resource requests: ' + external.join('\n'));
  checks.push('No browser/CSP errors or external resource requests');
  writeFileSync(join(output, 'report.json'), JSON.stringify({ checks, locales: locales.length, errors, external }, null, 2) + '\n');
  console.log('\nBrowser checks passed. Screenshots: ' + output);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
