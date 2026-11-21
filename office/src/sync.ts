/* Copies new website leads into the Back Office.
 *
 * The public site Worker keeps writing every form to its KV namespace exactly
 * as before (lead:RH-... hunt bookings, lead:RC-... contact form,
 * case:RCH-... hog trap requests). Opening Today or Leads checks KV for refs
 * the Back Office doesn't have yet and adds them, at most once a minute. No
 * cron (the account is at its cron limit) and nothing changes on the public site.
 *
 * Left out: spam (kept under spam:, never lead:), the blocklist, honeypot hits,
 * and test submissions (TEST in the name, or the ops inbox as the email).
 */
import type { Env } from './env';
import { isBlocked } from '../../worker/blocklist';
import { PROPERTY_FIELDS } from '../../src/data/trap-request';

type Row = { id: string; kind: string; name: string; phone: string; email: string; summary: string; details: [string, string][]; created_at: string };

const s = (v: unknown) => String(v ?? '').trim();
/** "2026-12-12" -> "Dec 12". Anything else passes through. */
const day = (v: unknown) => (/^\d{4}-\d{2}-\d{2}$/.test(s(v)) ? new Date(`${s(v)}T12:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' }) : s(v));
const pairs = (list: [string, unknown][]) => list.map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : s(v)] as [string, string]).filter(([, v]) => v);

function isTest(name: string, email: string): boolean {
  return /\btest\b/i.test(name) || email.toLowerCase() === 'ops@backcountrydrones.com';
}

function fromHuntBooking(r: any): Row {
  return {
    id: s(r.ref), kind: 'hunt', name: s(r.name), phone: s(r.phone), email: s(r.email), created_at: s(r.received),
    summary: [s(r.hunt_label), r.party ? `${s(r.party)} hunter${s(r.party) === '1' ? '' : 's'}` : '', day(r.date1)].filter(Boolean).join(' · '),
    details: pairs([
      ['Hunt', `${s(r.hunt_label)}${r.hunt_price ? ` (${s(r.hunt_price)})` : ''}`],
      ['First choice date', day(r.date1)], ['Second choice date', day(r.date2)], ['Dates flexible', r.flexible ? 'Yes' : ''],
      ['Hunters', r.party], ['Under 17', r.youth], ['Experience', r.experience], ['Guns', r.gear],
      ['From', r.hometown], ['Heard about us', r.heard], ['Message', r.message],
    ]),
  };
}

const CONTACT_KIND: Record<string, string> = { hunt: 'hunt', corporate: 'hunt', trapping: 'trap' };
const CONTACT_LABEL: Record<string, string> = { hunt: 'Hunt', corporate: 'Corporate or group hunt', trapping: 'Hog trapping', survey: 'Survey', other: 'Question' };

function fromContact(r: any): Row {
  const k = s(r.kind);
  return {
    id: s(r.ref), kind: CONTACT_KIND[k] ?? 'question', name: s(r.name), phone: s(r.phone), email: s(r.email), created_at: s(r.received),
    summary: [CONTACT_LABEL[k] ?? 'Question', s(r.interest), s(r.when), s(r.location)].filter(Boolean).join(' · '),
    details: pairs([
      ['Asking about', CONTACT_LABEL[k] ?? k], ['Interest', r.interest], ['When', r.when], ['Group size', r.party],
      ['Where', r.location], ['Acres', r.acreage], ['Message', r.message],
    ]),
  };
}

function fromTrapCase(c: any): Row {
  const i = c.intake ?? {};
  const p = i.property ?? {};
  const pin = Array.isArray(i.points) && i.points[0] ? `https://www.google.com/maps/search/?api=1&query=${i.points[0].lat},${i.points[0].lng}` : '';
  return {
    id: s(c.id), kind: 'trap', name: s(i.name), phone: s(i.phone), email: s(i.email), created_at: s(c.createdAt),
    summary: ['Hog trapping', p.county ? `${s(p.county)} County` : '', p.acreage ? `${s(p.acreage)} acres` : ''].filter(Boolean).join(' · '),
    details: pairs([
      ['Role', i.role],
      ...PROPERTY_FIELDS.map((f: any) => [f.label ?? f.name, p[f.name]] as [string, unknown]),
      ['Damage', i.damage], ['Tried so far', i.control], ['Details', i.control_detail], ['Message', i.message],
      ['Map pin', pin], ['Pins and areas', `${(i.points ?? []).length} pins, ${(i.areas ?? []).length} shaded areas`],
    ]),
  };
}

export async function syncFromSite(env: Env, force = false): Promise<number> {
  if (!env.LEADS) return 0;
  const now = Date.now();
  if (!force) {
    const last = await env.DB.prepare(`SELECT v FROM meta WHERE k = 'last_sync'`).first<string>('v');
    if (last && now - Number(last) < 60_000) return 0;
  }
  await env.DB.prepare(`INSERT INTO meta (k, v) VALUES ('last_sync', ?1) ON CONFLICT(k) DO UPDATE SET v = excluded.v`).bind(String(now)).run();

  const known = new Set(
    ((await env.DB.prepare(`SELECT id FROM leads WHERE source = 'website' UNION SELECT v FROM meta WHERE k LIKE 'skip:%'`).all<{ id: string }>()).results ?? []).map((r) => r.id)
  );

  const keys: string[] = [];
  for (const prefix of ['lead:', 'case:RCH-']) {
    let cursor: string | undefined;
    do {
      const page = await env.LEADS.list({ prefix, cursor });
      for (const k of page.keys) keys.push(k.name);
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor && keys.length < 5000);
  }

  let added = 0;
  for (const key of keys) {
    const ref = key.slice(key.indexOf(':') + 1);
    if (known.has(ref)) continue;
    const raw = await env.LEADS.get(key);
    if (!raw) continue;
    let rec: any;
    try { rec = JSON.parse(raw); } catch { continue; }
    const row = key.startsWith('case:') ? fromTrapCase(rec) : rec.kind === 'hunt_booking' ? fromHuntBooking(rec) : fromContact(rec);
    const skip = !row.id || !row.name || isTest(row.name, row.email) || isBlocked(row.name, row.email, row.phone) || rec?.intake?.honeypot === true;
    if (skip) {
      await env.DB.prepare(`INSERT OR IGNORE INTO meta (k, v) VALUES (?1, ?2)`).bind(`skip:${ref}`, ref).run();
      continue;
    }
    const at = row.created_at || new Date().toISOString();
    const res = await env.DB.prepare(
      `INSERT OR IGNORE INTO leads (id, kind, name, phone, email, summary, details, status, source, created_at, updated_at, created_by)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'new', 'website', ?8, ?8, 'Website')`
    ).bind(row.id, row.kind, row.name, row.phone, row.email, row.summary, JSON.stringify(row.details), at).run();
    if (res.meta.changes) {
      added++;
      await env.DB.prepare(`INSERT INTO activity (at, who, email, lead_id, kind, text) VALUES (?1, 'Website', '', ?2, 'event', ?3)`)
        .bind(at, row.id, `New ${row.kind === 'trap' ? 'hog trap request' : row.kind === 'hunt' ? 'hunt request' : 'question'} came in from the website`).run();
    }
  }
  return added;
}
