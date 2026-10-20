# CLAUDE.md

Operating instructions for Claude in this repo. Read before changing anything.

## What this is

The site for **Red Creek Outdoors LLC**, Killeen, Texas: feral hog trapping for landowners and guided hunts on private land. Astro 7 static build served from a Cloudflare Worker (Justin's account, alongside backcountrydrones.com). Replaces a GoDaddy Website Builder site. The migration plan is `migration-runbook.md` in the Claude project; the URL inventory is `site-inventory.md`.

Owners: Ray Fazio and Cody Petty. Justin Cox runs the project. This is a client site.

## Voice

BLUF, contractions, short declaratives mixed with longer sentences, specific over vague. Gritty but professional. **No em or en dashes, ever** (verify fails the build). Banned words are listed in `scripts/verify.mjs` and also fail the build.

## Hard content rules

1. **Never invent a number, method detail or story.** Prices come from `src/consts.ts` and nowhere else. If a fact is unknown, leave it out and ask Justin.
2. **Every legal or regulatory line is sourced** to TPWD, USFWS/eCFR, TAHC or the installation, and the source is linked on the page. Hunt-page sources live in `src/data/hunts/sources.ts`. Season dates change every August: re-check against the new Outdoor Annual and update the hunt files the same day.
3. **Drones and hunts never mix in copy.** TPWD says drone use to hunt, drive, take, count or photograph wildlife is unlawful without a permit, and drones can't be used to find wounded game. Surveys are flown by Backcountry Drones under its TPWD permit.
4. **No client names, property names or locations** without written permission. Hunt towns are named (Salado, Marlin, Gatesville, Rogers, Holland); properties never are. The solar client is "commercial solar sites" until written permission.
5. **Fort Hood**, not Fort Cavazos.
6. **Facts match the Business Profile word for word:** name, phone 254-397-8938, Killeen, hours "Open 24 hours", prices, counties. Change `consts.ts`, then the Business Profile the same day.

## SEO controls (learned on backcountrydrones.com; don't relearn them)

- Canonical must equal the served URL. `Base.astro` strips the `.html` that `build.format: 'file'` adds at build time. verify fails on any mismatch.
- Every old GoDaddy URL keeps its address. `public/_redirects`: **exact rules on top, splats below, never interleaved.** Never redirect a specific page to the home page if anything closer exists. Old redirects stay forever.
- Town pages (`src/data/towns/<town>.ts`) are different pages, not a template with the name swapped. 850+ words, under 25% shared 6-word sequences with any other town. verify enforces both.
- Don't change a title, H1, URL or redirect on a page with Search Console impressions without telling Justin first. Log every change to a ranking or target page in `seo-change-log.md` in the project.
- Content Google needs (reviews, prices, FAQs) is server-rendered. No client-side widgets as the only copy.
- Sitemap lastmod is the git date of the page's own source file. CI needs full history (`fetch-depth: 0`).

## Git

Stage by filename, never `git add -A`. Fetch and rebase before every push; more than one session commits here. Push to `main` deploys. After every deploy, check the change on the live site.

## Commands

```
npm run dev       # localhost:4321
npm run build     # to dist/
npm run verify    # the gate CI runs; any FAIL stops the deploy
npm run preview   # wrangler dev, Worker plus assets on :8787
```

## Worker

`worker/index.ts`: `POST /api/request` stores the lead in KV (`LEADS`) first, then emails it through Resend. `run_worker_first` is `true`: the Worker answers every request so it can 301 www to the apex, then hands pages to `env.ASSETS` (which still applies `_redirects`, `_headers` and the 404 page). Live since 2026-10-20 via zone routes in wrangler.jsonc. Rollback: comment the routes out and push. `scripts/smoke.sh` checks the live domain after every deploy; a failing smoke step means the live site is wrong, so look before pushing anything else. Secrets (`RESEND_API_KEY`) are set with `wrangler secret put` and never committed or pasted in chat.

Mail: the apex DMARC is `p=reject`. Send only from a verified Resend subdomain. Interim sender is `send.backcountrydrones.com`; switch to `send.redcreekoutdoors.com` once verified (runbook F7).
