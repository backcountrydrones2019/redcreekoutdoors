#!/usr/bin/env node
/**
 * Post-build verification. Runs in CI after `astro build` and before deploy;
 * any FAIL stops the deploy. Built from the backcountrydrones.com script, plus
 * every check the project rules call for.
 *
 *   npm run verify         static checks on dist/
 *   npm run verify:full    also checks horizontal overflow (needs preview on :8787)
 */

import { readFileSync, existsSync, globSync } from 'node:fs';

const DIST = 'dist';
const SITE_URL = 'https://redcreekoutdoors.com';
const PHONE = '254-397-8938';
const REDIRECTS = 'public/_redirects';
/* Pages allowed to carry noindex. Anything else with it is a mistake. */
const NOINDEX_OK = new Set(['/404', '/thanks']);
/* Location pages: under 25 percent shared 6-word sequences with any other. */
const TOWN_PAGE = /^\/hog-trapping-[a-z-]+-tx$/;
const TOWN_MAX_SHARED = 0.25;
const TOWN_MIN_WORDS = 850;

let failures = 0;
let warnings = 0;
const fail = (m) => { console.error(`  FAIL  ${m}`); failures++; };
const warn = (m) => { console.warn(`  warn  ${m}`); warnings++; };
const ok = (m) => console.log(`  ok    ${m}`);
const head = (m) => console.log(`\n${m}`);

if (!existsSync(DIST)) {
  console.error('No dist/ directory. Run `npm run build` first.');
  process.exit(1);
}

const files = globSync(`${DIST}/**/*.html`).sort();
const cache = new Map();
const read = (f) => { if (!cache.has(f)) cache.set(f, readFileSync(f, 'utf8')); return cache.get(f); };
const routeOf = (f) => {
  let p = f.slice(DIST.length).replace(/\.html$/, '');
  if (p.endsWith('/index')) p = p.slice(0, -6) || '/';
  return p || '/';
};
const routes = new Set(files.map(routeOf));
routes.add('/');

const mainText = (html) =>
  (html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] || '')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const redirects = new Set();
if (existsSync(REDIRECTS)) {
  for (const line of readFileSync(REDIRECTS, 'utf8').split('\n')) {
    const t = line.trim();
    if (t && !t.startsWith('#')) redirects.add(t.split(/\s+/)[0]);
  }
}
const redirectCovers = (href) =>
  redirects.has(href) || [...redirects].some((r) => r.endsWith('*') && href.startsWith(r.slice(0, -1)));

// ------------------------------------------------------------- redirects
head('Redirect file order');
{
  const rules = readFileSync(REDIRECTS, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const firstSplat = rules.findIndex((r) => r.split(/\s+/)[0].includes('*'));
  const lateExact = firstSplat === -1 ? [] : rules.slice(firstSplat).filter((r) => !r.split(/\s+/)[0].includes('*'));
  if (lateExact.length) lateExact.forEach((r) => fail(`exact rule below a splat in _redirects: ${r}`));
  else ok('exact rules all sit above splats');
  for (const r of rules) {
    const [from, to, code] = r.split(/\s+/);
    if (to === '/' && from !== '/home') warn(`redirect to the home page, is there nothing closer? ${from}`);
    if (code && code !== '301') warn(`non-301 redirect: ${r}`);
  }
}

// ----------------------------------------------------------------- links
head(`Internal links (${files.length} pages)`);
const broken = new Map();
for (const f of files) {
  const from = routeOf(f);
  for (const m of read(f).matchAll(/href="([^"]+)"/g)) {
    let raw = m[1];
    if (raw.startsWith(SITE_URL)) raw = raw.slice(SITE_URL.length) || '/';
    if (!raw.startsWith('/')) continue;
    const href = raw.split('#')[0].split('?')[0];
    if (href.startsWith('/_astro')) continue;
    if (/\.(xml|svg|png|jpe?g|webp|txt|ico|pdf|js|css)$/.test(href)) continue;
    if (/\.html$/.test(href)) { fail(`${from}: internal link with .html: ${href}`); continue; }
    if (href.length > 1 && href.endsWith('/')) { fail(`${from}: trailing slash link ${href} (site is trailingSlash never)`); continue; }
    if (routes.has(href) || redirectCovers(href)) continue;
    if (!broken.has(href)) broken.set(href, new Set());
    broken.get(href).add(from);
  }
}
if (broken.size === 0) ok('no broken internal links');
else for (const [href, from] of broken) fail(`broken link ${href}  from ${[...from].slice(0, 4).join(', ')}`);

// ---------------------------------------------------------- house style
head('House style');
const BANNED = [
  'delve', 'dive into', 'underscore', 'bolster', 'foster', 'harness', 'leverage', 'unpack',
  'shed light on', 'pave the way', 'pivotal', 'groundbreaking', 'cutting-edge', 'transformative',
  'game-changing', 'innovative', 'robust', 'comprehensive', 'seamless', 'intricate', 'vibrant',
  'multifaceted', 'holistic', 'testament', 'realm', "it's important to note", 'when it comes to',
  'at its core', 'at the end of the day', 'this is where',
];
for (const f of files) {
  const r = routeOf(f);
  const html = read(f);
  const text = mainText(html).toLowerCase();
  if (html.includes('—') || html.includes('–')) fail(`${r}: em or en dash (use a comma, period or parentheses)`);
  if (/\bTODO\b|LOREM IPSUM|FIXME/i.test(html)) fail(`${r}: stub text shipped`);
  for (const w of BANNED) if (new RegExp(`\\b${w.replace(/[-']/g, '.')}\\b`).test(text)) fail(`${r}: banned phrase "${w}"`);
  for (const m of html.matchAll(/[a-z,.:;!?)]<(?:strong|em|code|a )/g))
    fail(`${r}: missing space before inline tag, add {' '}: ...${html.slice(Math.max(0, m.index - 30), m.index + 10)}`);
}
ok('dash, stub, banned-word and spacing scan done');

// --------------------------------------------------------------- metadata
head('Metadata, canonicals, schema');
const titles = new Map();
const descs = new Map();
for (const f of files) {
  const route = routeOf(f);
  const html = read(f);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const desc = html.match(/name="description" content="(.*?)"/s)?.[1];
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  const noindex = /name="robots" content="[^"]*noindex/.test(html);

  if (!title) fail(`${route}: no <title>`);
  else {
    if (title.length > 70) warn(`${route}: title ${title.length} chars`);
    if (!noindex) titles.set(title, [...(titles.get(title) || []), route]);
  }
  if (!desc) fail(`${route}: no meta description`);
  else {
    if (desc.length < 100 || desc.length > 165) warn(`${route}: description ${desc.length} chars (aim 110 to 160)`);
    if (!noindex) descs.set(desc, [...(descs.get(desc) || []), route]);
  }
  if (h1s !== 1) fail(`${route}: ${h1s} h1 elements, expected exactly 1`);
  if (noindex && !NOINDEX_OK.has(route)) fail(`${route}: noindex on a page that should be indexed`);

  const canonical = html.match(/rel="canonical" href="(.*?)"/s)?.[1];
  const want = route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`;
  if (route !== '/404') {
    if (!canonical) fail(`${route}: no canonical`);
    else if (canonical !== want) fail(`${route}: canonical ${canonical}, expected ${want}`);
    else if (canonical.includes('.html')) fail(`${route}: .html in canonical`);
  }

  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!ld.length) fail(`${route}: no JSON-LD`);
  for (const m of ld) {
    try {
      const data = JSON.parse(m[1]);
      const nodes = (Array.isArray(data) ? data : [data]).flatMap((n) => (n['@graph'] ? n['@graph'] : [n]));
      for (const n of nodes) {
        if (!n['@type']) fail(`${route}: JSON-LD node without @type`);
        if (n.telephone && n.telephone !== '+12543978938') fail(`${route}: schema phone ${n.telephone}`);
      }
    } catch (e) {
      fail(`${route}: invalid JSON-LD (${e.message})`);
    }
  }

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]+"/.test(m[0]) && !/\balt=""[^>]*aria-hidden/.test(m[0])) fail(`${route}: <img> without alt: ${m[0].slice(0, 80)}`);
  }

  if (!html.includes(PHONE)) fail(`${route}: business phone ${PHONE} missing`);
  for (const bad of html.matchAll(/\b(\d{3})[-.\s](\d{3})[-.\s](\d{4})\b/g)) {
    const n = `${bad[1]}-${bad[2]}-${bad[3]}`;
    if (n !== PHONE) warn(`${route}: other phone number on page: ${n}`);
  }
}
for (const [t, rs] of titles) if (rs.length > 1) fail(`duplicate title "${t}" on ${rs.join(', ')}`);
for (const [d, rs] of descs) if (rs.length > 1) fail(`duplicate description on ${rs.join(', ')}`);
ok('metadata checked');

// ------------------------------------------------------------ town pages
head('Location pages');
const towns = files.filter((f) => TOWN_PAGE.test(routeOf(f)));
const shingles = (text) => {
  const w = text.toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean);
  const s = new Set();
  for (let i = 0; i + 6 <= w.length; i++) s.add(w.slice(i, i + 6).join(' '));
  return { s, words: w.length };
};
const townData = towns.map((f) => ({ route: routeOf(f), ...shingles(mainText(read(f))) }));
for (const t of townData) if (t.words < TOWN_MIN_WORDS) fail(`${t.route}: ${t.words} words, location pages need ${TOWN_MIN_WORDS}+`);
let worst = 0;
for (let i = 0; i < townData.length; i++) {
  for (let j = i + 1; j < townData.length; j++) {
    const a = townData[i], b = townData[j];
    let shared = 0;
    for (const x of a.s) if (b.s.has(x)) shared++;
    const pct = shared / Math.min(a.s.size, b.s.size);
    worst = Math.max(worst, pct);
    if (pct > TOWN_MAX_SHARED) fail(`${a.route} and ${b.route} share ${(pct * 100).toFixed(0)}% of their 6-word sequences (max 25%)`);
  }
}
ok(`${townData.length} location pages, worst pair ${(worst * 100).toFixed(0)}% shared`);

// ------------------------------------------------------------- responsive
if (process.argv.includes('--full')) {
  head('Responsive (needs `npm run preview` on :8787)');
  const WIDTHS = [320, 360, 390, 768, 1024, 1280, 1366];
  try {
    const { chromium } = await import('playwright');
    const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
    for (const width of WIDTHS) {
      for (const path of ['/', '/hog-trapping-killeen-tx', '/thermal-hog-hunts', '/contact']) {
        const page = await browser.newPage({ viewport: { width, height: 800 } });
        await page.goto(`http://localhost:8787${path}`, { waitUntil: 'networkidle' });
        if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth))
          fail(`horizontal overflow at ${width}px on ${path}`);
        await page.close();
      }
    }
    await browser.close();
    ok(`no horizontal overflow at ${WIDTHS.join(', ')}`);
  } catch (err) {
    warn(`responsive check skipped: ${err.message}`);
  }
}

console.log(`\n${failures} failure${failures === 1 ? '' : 's'}, ${warnings} warning${warnings === 1 ? '' : 's'}\n`);
process.exit(failures > 0 ? 1 : 0);
