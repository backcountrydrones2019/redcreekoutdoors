# RCO Back Office

office.redcreekoutdoors.com. Leads from every website form, a hunt calendar,
call backs, and a log of who did what. Built for Justin, Ray and Cody: big
buttons, plain words, works on a phone or a laptop.

## Pieces

- `src/index.ts` routes and every save. Each save writes one `activity` row
  with the person's name: that's the "Who did what" screen. Activity can't be
  edited or deleted (database triggers).
- `src/pages.ts` every screen. `src/ui.ts` the shell, styles and icons.
- `src/sync.ts` copies new website leads (KV `lead:` and `case:RCH-`) into the
  database when someone opens Today or Leads, at most once a minute. No cron.
  Spam, the blocklist, honeypot hits and TEST submissions are skipped.
- `src/auth.ts` Cloudflare Access sign-in check (ported from the BCD console).
  Only emails in `USERS` (wrangler.jsonc) get in.
- D1 database `rco-office`. Schema in `migrations/`.

Hunt types and prices come from the site (`src/data/hunt-booking.ts`,
`src/consts.ts`), so a price change on the site shows up here too.

## Add a person

1. `USERS` in `office/wrangler.jsonc`: add `email:Name`.
2. Zero Trust > Access > Applications > RCO Back Office > policy: add the same email.
3. Push. They sign in with an emailed code.

## Database changes

Add `migrations/000N_name.sql`, test with `npm run office:dev`, then apply to
the live database by hand (`wrangler d1 migrations apply rco-office --remote
-c office/wrangler.jsonc`, or run the SQL through the Cloudflare connector and
add the row to `d1_migrations`). CI never touches the schema.

## Run it locally

`office/.dev.vars` (not committed):

```
DEV_AUTH_EMAIL=justin@backcountrydrones.com
DEV_AUTH_TOKEN=<anything>
USERS=justin@backcountrydrones.com:Justin,ray@example.com:Ray,cody@example.com:Cody
```

`npm run office:dev`, then open `http://127.0.0.1:8790/dev-login?t=<token>`.
