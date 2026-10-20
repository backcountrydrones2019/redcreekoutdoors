// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

/* SITEMAP, carried over from backcountrydrones.com.
 *
 * lastmod is the date of the last git commit that touched the page's own
 * source file (or the data file that feeds it), never the build time and never
 * a shared layout. Google only trusts lastmod when it is consistently accurate.
 * Needs full git history in CI: deploy.yml checks out with fetch-depth 0. If
 * git can't answer, the URL ships without a lastmod rather than a wrong one.
 *
 * The site has no catalog yet, so there is one pages sitemap under the index.
 * If a gallery or shop is ever added, chunk it out the way backcountrydrones.com
 * chunks /shop so it can't soak up crawl meant for the service pages. */

const gitCache = new Map();
function gitDate(files) {
  const present = files.filter((f) => existsSync(f));
  if (!present.length) return undefined;
  const key = present.join('|');
  if (gitCache.has(key)) return gitCache.get(key);
  let iso;
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...present], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    iso = out || undefined;
  } catch {
    iso = undefined;
  }
  gitCache.set(key, iso);
  return iso;
}

/** Source files that decide what a URL says. */
function sourcesFor(pathname) {
  const p = pathname.replace(/\/$/, '') || '/';
  if (p === '/') return ['src/pages/index.astro'];
  let m;
  if ((m = p.match(/^\/field-notes\/(.+)$/)))
    return [`src/content/field-notes/${m[1]}.md`, `src/content/field-notes/${m[1]}.mdx`];
  if ((m = p.match(/^\/hog-trapping-([a-z-]+)-tx$/)))
    return ['src/pages/hog-trapping-[town]-tx.astro', `src/data/towns/${m[1]}.ts`];
  if ((m = p.match(/^\/(thermal-hog-hunts|thermal-predator-hunts|whitetail-deer-hunts|dove-hunts|teal-hunts|duck-hunts)$/)))
    return ['src/pages/[hunt].astro', `src/data/hunts/${m[1]}.ts`];
  return [`src/pages${p}.astro`, `src/pages${p}/index.astro`];
}

export default defineConfig({
  site: 'https://redcreekoutdoors.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    // dist/hog-trapping-killeen-tx.html, served at /hog-trapping-killeen-tx.
    // Base.astro strips the .html Astro sees at build time out of the
    // canonical. That bug cost backcountrydrones.com its whole index once.
    format: 'file',
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/(thanks|404)\/?$/.test(page),
      serialize: (item) => {
        const lastmod = gitDate(sourcesFor(new URL(item.url).pathname));
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});
