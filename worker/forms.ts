/* /api/trap-request and /api/hunt-booking.
 *
 * Both take JSON from their page, check the required fields and every
 * acknowledgment server side (the page checks too, but a page check is a
 * convenience, not a control), store the record in KV first, then email it.
 *
 * Hunt bookings carry a consent record: which marketing channels the person
 * checked, the exact wording they saw (CONSENT_VERSION plus the text itself),
 * when, and the request's IP and user agent. That record is what shows a
 * person agreed to marketing texts, so it is stored whole and never edited.
 */
import { ACKNOWLEDGEMENTS as TRAP_ACKS, PROPERTY_FIELDS } from '../src/data/trap-request';
import { confirmationId, openCase } from './cases';
import { centroid, firstNameOf, linkRow, mapsLink, opsDoc, receiptHtml, row, section, sendOps, sendReceipt, sourceLine } from './mail';
import { ACKNOWLEDGEMENTS as HUNT_ACKS, CONSENT, CONSENT_VERSION, HUNT_OPTIONS } from '../src/data/hunt-booking';
import { DEPOSIT } from '../src/consts';

export interface FormEnv {
  LEADS?: KVNamespace;
  RESEND_API_KEY?: string;
  MAIL_TO: string;
  MAIL_FROM: string;
  /** Optional fan-out of every hog trap request, same hook BCD has. Unset by default. */
  CASE_WEBHOOK?: string;
}

const s = (v: unknown, max = 600) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const arr = (v: unknown, max = 30) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(0, max).map((x) => s(x, 200)) : []);
const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

function makeRef(prefix: string): string {
  const d = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const r = crypto.getRandomValues(new Uint16Array(1))[0] % 10000;
  return `${prefix}-${d}-${String(r).padStart(4, '0')}`;
}

async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  if (req.method !== 'POST') return null;
  if (!(req.headers.get('content-type') || '').includes('application/json')) return null;
  try {
    const t = await req.text();
    if (t.length > 200_000) return null;
    return JSON.parse(t);
  } catch {
    return null;
  }
}

function meta(req: Request) {
  return {
    received: new Date().toISOString(),
    ip: req.headers.get('cf-connecting-ip') || '',
    country: req.headers.get('cf-ipcountry') || '',
    user_agent: s(req.headers.get('user-agent') || '', 300),
  };
}

async function mail(env: FormEnv, subject: string, html: string, replyTo?: string) {
  if (!env.RESEND_API_KEY || !env.MAIL_TO) {
    console.warn('stored without email: RESEND_API_KEY or MAIL_TO not set:', subject);
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, to: env.MAIL_TO.split(',').map((x) => x.trim()).filter(Boolean), reply_to: replyTo || undefined, subject, html }),
  });
  if (!res.ok) console.error('resend failed', res.status, await res.text());
}

function table(rows: [string, string][]) {
  return `<table cellpadding="6" style="font-family:sans-serif;border-collapse:collapse">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><th align="left" valign="top" style="white-space:nowrap">${esc(k)}</th><td>${esc(v).replace(/\n/g, '<br>')}</td></tr>`)
    .join('')}</table>`;
}
const callRow = (phone: string) => (phone ? `<tr><td colspan="2" style="padding:4px 0 10px"><a href="tel:${esc(phone.replace(/[^\d+]/g, ''))}" style="font:700 18px/1.3 -apple-system,sans-serif;color:#c1282c">Call ${esc(phone)}</a></td></tr>` : '');
const callLink = (phone: string) => (phone ? `<p><a href="tel:${esc(phone.replace(/[^\d+]/g, ''))}" style="font-size:18px">Call ${esc(phone)}</a></p>` : '');

/* ------------------------------------------------------------ trap request
 * Same intake as the backcountrydrones.com hog assessment (ported 2026-10-31):
 *   1. a case record at case:<ref> plus a board index key (worker/cases.ts)
 *   2. the ops email, awaited, with every pin and shaded area as a maps link
 *   3. a receipt to the landowner with the reference number
 * If the ops email fails the case and receipt still stand and the page tells
 * the visitor to call. Red Creek keeps its stricter server-side checks (every
 * acknowledgment, address, acreage, county), which BCD only does in the page.
 * Not ported: the Quo contact sync (Red Creek doesn't use Quo) and the live /
 * abandoned form alerts (they need a per-minute cron and the account is at its
 * cron limit).
 */
const AREA_LABELS: Record<string, string> = { damage: 'Damage area', nogo: 'Off limits' };
const PROPERTY_LABEL = Object.fromEntries(PROPERTY_FIELDS.map((f) => [f.name, f.label])) as Record<string, string>;

function sameOrigin(req: Request): boolean {
  const o = req.headers.get('origin');
  if (!o) return true; // some privacy setups strip Origin on same-site posts
  try { return new URL(o).host === new URL(req.url).host; } catch { return false; }
}

export async function handleTrapRequest(req: Request, env: FormEnv, ctx: ExecutionContext): Promise<Response> {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { allow: 'POST' } });
  if (!sameOrigin(req)) return json({ error: 'forbidden' }, 403);
  const b = await readJson(req);
  if (!b) return json({ error: 'bad request' }, 400);

  const p = (b.property && typeof b.property === 'object' ? b.property : {}) as Record<string, unknown>;
  const property = Object.fromEntries(PROPERTY_FIELDS.map((f) => [f.name, s(p[f.name], 300)])) as Record<string, string>;
  const acks = arr(b.acks);
  const missing = ['name', 'phone', 'email', 'message'].filter((k) => !s(b[k])).concat(['address', 'acreage', 'county'].filter((k) => !property[k]));
  if (s(b.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s(b.email))) missing.push('email');
  const unacked = TRAP_ACKS.map((a) => a.key).filter((k) => !acks.includes(k));
  if (missing.length || unacked.length) return json({ error: 'incomplete', missing, unacked }, 422);

  // Honeypot: flagged in the subject, not dropped (BCD's rule). A real landowner
  // whose autofill hit the hidden field still gets worked.
  const hp = s(b.website) ? '[HONEYPOT] ' : '';

  const points = (Array.isArray(b.points) ? b.points : []).slice(0, 100)
    .map((x: any) => ({ kind: s(x?.kind, 20), label: s(x?.label, 60), lat: +x?.lat, lng: +x?.lng }))
    .filter((x) => Number.isFinite(x.lat) && Number.isFinite(x.lng));
  const areas = (Array.isArray(b.areas) ? b.areas : []).slice(0, 40)
    .map((x: any) => ({ kind: s(x?.kind, 20), points: (Array.isArray(x?.points) ? x.points : []).slice(0, 200).map((q: any) => [+q?.[0], +q?.[1]] as [number, number]).filter((q: [number, number]) => q.every(Number.isFinite)) }))
    .filter((a) => a.points.length >= 3);

  const name = s(b.name, 120), phone = s(b.phone, 40), email = s(b.email, 160);
  const store = env.LEADS;
  const ref = await confirmationId('RCH', phone, store);
  const m = meta(req);
  const source = b.source && typeof b.source === 'object' ? (b.source as Record<string, unknown>) : { landing: s(b.landing, 300), referrer: s(b.referrer, 300) };
  const damage = arr(b.damage, 40), control = arr(b.control, 40);

  const intake = {
    ...m,
    name, phone, email, role: s(b.role, 80),
    property, damage, control, control_detail: s(b.control_detail, 3000), message: s(b.message, 4000),
    points, areas, source,
    acks: TRAP_ACKS.map((a) => ({ key: a.key, text: a.text })),
    honeypot: !!hp,
  };

  // 1. Case first. A mail outage never loses a request.
  if (store) {
    await openCase(store, {
      id: ref, kind: 'hog', title: `Hog trap request, ${name}`, locality: property.county,
      party: { name, email, phone }, intake,
      event: { kind: 'intake', actor: 'client', visibility: 'internal', title: 'Hog trap request received' },
    });
  }

  // 2. Ops email.
  const pointRows = points.map((pt) => linkRow(pt.label || pt.kind, mapsLink(pt.lat, pt.lng), `${pt.lat}, ${pt.lng}`)).join('');
  const areaRows = areas.map((a) => {
    const c = centroid(a.points);
    const label = `${AREA_LABELS[a.kind] || a.kind} (${a.points.length} pts)`;
    return c ? linkRow(label, mapsLink(c[0], c[1]), `center ${c[0]}, ${c[1]}`) : row(label, 'shape in the stored record');
  }).join('');
  const propRows = PROPERTY_FIELDS.map((f) => row(PROPERTY_LABEL[f.name], property[f.name])).join('');
  const inner = opsDoc('Hog Trap Request', name, ref,
    callRow(phone) + row('Phone', phone) + row('Email', email) + row('Relationship', s(b.role, 80)) +
    section('Property') + propRows +
    (damage.length ? section('Damage') + row('Types', damage.join(', ')) : '') +
    (control.length || intake.control_detail ? section('Already tried') + row('Methods', control.join(', ')) + row('How it went', intake.control_detail) : '') +
    (points.length || areas.length ? section('Marked on the map') + pointRows + areaRows : '') +
    section('Notes') + row('Details', intake.message) +
    row('Source', sourceLine(source)) +
    section('Acknowledged') + row('Checked', `${acks.filter((k) => TRAP_ACKS.some((a) => a.key === k)).length} of ${TRAP_ACKS.length}`)
  );
  const opsOk = await sendOps(env, `${hp}Hog trap request: ${name}, ${property.county} County [${ref}]`, inner, email);

  // 3. Receipt to the landowner, even if the ops copy failed (they did their part).
  if (!hp) {
    sendReceipt(ctx, env, email, `We have your hog trap request. ${ref}`, receiptHtml({
      firstName: firstNameOf(name),
      headline: 'Got it.',
      body: 'we have your hog trap request and the map you marked. Keep this email, the reference number is in it.',
      ref,
      extraHtml: `<p style="margin:0 0 14px">Next, we call to talk through the property and set up a site assessment. There's no deposit, and the price is set in writing before any work starts.</p>`,
    }));
  }

  if (!opsOk) return json({ error: 'send failed', ref }, 502);

  if (env.CASE_WEBHOOK) {
    ctx.waitUntil(fetch(env.CASE_WEBHOOK, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type: 'hog-trap-request', ref, ...intake }) }).then(() => {}).catch((err) => console.error('case webhook failed', err)));
  }
  return json({ ok: true, ref });
}

/* ------------------------------------------------------------ hunt booking */
export async function handleHuntBooking(req: Request, env: FormEnv, ctx: ExecutionContext): Promise<Response> {
  const b = await readJson(req);
  if (!b) return json({ error: 'bad request' }, 400);
  if (s(b.website)) return json({ ok: true, ref: makeRef('RH') });

  const hunt = HUNT_OPTIONS.find((h) => h.value === s(b.hunt, 40));
  const acks = arr(b.acks);
  const missing = ['name', 'phone', 'email', 'date1', 'party'].filter((k) => !s(b[k]));
  if (!hunt) missing.push('hunt');
  const unacked = HUNT_ACKS.map((a) => a.key).filter((k) => !acks.includes(k));
  if (missing.length || unacked.length) return json({ error: 'incomplete', missing, unacked }, 422);

  const checked = arr(b.consent);
  const m = meta(req);
  const consent = {
    version: CONSENT_VERSION,
    submitted_version: s(b.consent_version, 60),
    at: m.received,
    phone: s(b.phone, 40),
    email: s(b.email, 160),
    ip: m.ip,
    user_agent: m.user_agent,
    channels: CONSENT.map((c) => ({ key: c.key, granted: checked.includes(c.key), text: c.text })),
  };

  const rec = {
    ref: makeRef('RH'),
    kind: 'hunt_booking',
    ...m,
    hunt: hunt!.value, hunt_label: hunt!.label, hunt_price: hunt!.price,
    date1: s(b.date1, 20), date2: s(b.date2, 20), flexible: b.flexible === true,
    party: s(b.party, 20), youth: s(b.youth, 20), experience: s(b.experience, 60), gear: s(b.gear, 60),
    name: s(b.name, 120), phone: s(b.phone, 40), email: s(b.email, 160), hometown: s(b.hometown, 120), heard: s(b.heard, 60), message: s(b.message, 4000),
    acks: HUNT_ACKS.map((a) => ({ key: a.key, text: a.text })),
    consent,
    landing: s(b.landing, 300), referrer: s(b.referrer, 300),
  };
  if (env.LEADS) {
    await env.LEADS.put(`lead:${rec.ref}`, JSON.stringify(rec), { metadata: { kind: rec.kind, received: rec.received, hunt: rec.hunt } });
    // Separate consent log, one entry per submission, never overwritten.
    await env.LEADS.put(`consent:${rec.received}:${rec.ref}`, JSON.stringify(consent));
  }

  const granted = consent.channels.filter((c) => c.granted).map((c) => c.key.replace('_marketing', '')).join(', ') || 'none';
  const html = `<h2 style="font-family:sans-serif">Hunt request: ${esc(rec.hunt_label)} for ${esc(rec.name)}</h2>${callLink(rec.phone)}${table([
    ['Hunt', `${rec.hunt_label} (${rec.hunt_price})`], ['First choice', rec.date1], ['Second choice', rec.date2], ['Flexible', rec.flexible ? 'Yes' : 'No'],
    ['Hunters', rec.party], ['Under 17', rec.youth], ['Experience', rec.experience], ['Guns', rec.gear],
    ['Name', rec.name], ['Phone', rec.phone], ['Email', rec.email], ['From', rec.hometown], ['Heard via', rec.heard], ['Message', rec.message],
    ['Marketing OK by', granted],
    ['Deposit', `${DEPOSIT.text}, nonrefundable, due once you confirm the hunt. Acknowledged.`],
    ['Landed on', rec.landing], ['Came from', rec.referrer], ['Ref', rec.ref],
  ])}`;
  ctx.waitUntil(mail(env, `Hunt request: ${rec.hunt_label}, ${rec.date1}, ${rec.party} hunter(s), ${rec.name} [${rec.ref}]`, html, rec.email));
  return json({ ok: true, ref: rec.ref });
}
