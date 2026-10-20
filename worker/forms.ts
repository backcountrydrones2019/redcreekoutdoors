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
import { ACKNOWLEDGEMENTS as TRAP_ACKS } from '../src/data/trap-request';
import { ACKNOWLEDGEMENTS as HUNT_ACKS, CONSENT, CONSENT_VERSION, HUNT_OPTIONS } from '../src/data/hunt-booking';
import { DEPOSIT } from '../src/consts';

export interface FormEnv {
  LEADS?: KVNamespace;
  RESEND_API_KEY?: string;
  MAIL_TO: string;
  MAIL_FROM: string;
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
const callLink = (phone: string) => (phone ? `<p><a href="tel:${esc(phone.replace(/[^\d+]/g, ''))}" style="font-size:18px">Call ${esc(phone)}</a></p>` : '');

/* ------------------------------------------------------------ trap request */
export async function handleTrapRequest(req: Request, env: FormEnv, ctx: ExecutionContext): Promise<Response> {
  const b = await readJson(req);
  if (!b) return json({ error: 'bad request' }, 400);
  if (s(b.website)) return json({ ok: true, ref: makeRef('RT') }); // honeypot

  const p = (b.property && typeof b.property === 'object' ? b.property : {}) as Record<string, unknown>;
  const property = Object.fromEntries(['address', 'acreage', 'county', 'sounder', 'duration', 'cell', 'trailer', 'livestock', 'neighbors'].map((k) => [k, s(p[k], 300)]));
  const acks = arr(b.acks);
  const missing = ['name', 'phone', 'email', 'message'].filter((k) => !s(b[k])).concat(['address', 'acreage', 'county'].filter((k) => !property[k]));
  const unacked = TRAP_ACKS.map((a) => a.key).filter((k) => !acks.includes(k));
  if (missing.length || unacked.length) return json({ error: 'incomplete', missing, unacked }, 422);

  const points = (Array.isArray(b.points) ? b.points : []).slice(0, 60).map((x: any) => ({ kind: s(x?.kind, 20), label: s(x?.label, 40), lat: +x?.lat || 0, lng: +x?.lng || 0 }));
  const areas = (Array.isArray(b.areas) ? b.areas : []).slice(0, 30).map((x: any) => ({ kind: s(x?.kind, 20), points: (Array.isArray(x?.points) ? x.points : []).slice(0, 200).map((q: any) => [+q?.[0] || 0, +q?.[1] || 0]) }));

  const rec = {
    ref: makeRef('RT'),
    kind: 'trap_request',
    ...meta(req),
    name: s(b.name, 120), phone: s(b.phone, 40), email: s(b.email, 160), role: s(b.role, 80),
    property, damage: arr(b.damage), control: arr(b.control), control_detail: s(b.control_detail, 3000), message: s(b.message, 4000),
    acks: TRAP_ACKS.map((a) => ({ key: a.key, text: a.text })), points, areas,
    landing: s(b.landing, 300), referrer: s(b.referrer, 300),
  };
  if (env.LEADS) await env.LEADS.put(`lead:${rec.ref}`, JSON.stringify(rec), { metadata: { kind: rec.kind, received: rec.received } });

  const pinList = points.map((pt) => `${pt.label}: https://maps.google.com/?q=${pt.lat},${pt.lng}`).join('\n');
  const html = `<h2 style="font-family:sans-serif">Hog trap request: ${esc(rec.name)}</h2>${callLink(rec.phone)}${table([
    ['Name', rec.name], ['Phone', rec.phone], ['Email', rec.email], ['Relationship', rec.role],
    ['Property', property.address], ['Acreage', property.acreage], ['County', property.county], ['Most seen at once', property.sounder],
    ['Going on', property.duration], ['Cell service', property.cell], ['Trailer access', property.trailer], ['Livestock or dogs', property.livestock], ['Neighbors', property.neighbors],
    ['Damage', rec.damage.join(', ')], ['Tried', rec.control.join(', ')], ['How that went', rec.control_detail], ['Message', rec.message],
    ['Map pins', pinList], ['Shaded areas', areas.length ? `${areas.length} (full shapes in the stored record)` : ''],
    ['Deposit', `${DEPOSIT.text} nonrefundable, due once you confirm the site assessment. Acknowledged.`],
    ['Landed on', rec.landing], ['Came from', rec.referrer], ['Ref', rec.ref],
  ])}`;
  ctx.waitUntil(mail(env, `Hog trap request: ${rec.name}, ${property.county} County [${rec.ref}]`, html, rec.email));
  return json({ ok: true, ref: rec.ref });
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
    ['Deposit', `${DEPOSIT.text} nonrefundable, due once you confirm the hunt. Acknowledged.`],
    ['Landed on', rec.landing], ['Came from', rec.referrer], ['Ref', rec.ref],
  ])}`;
  ctx.waitUntil(mail(env, `Hunt request: ${rec.hunt_label}, ${rec.date1}, ${rec.party} hunter(s), ${rec.name} [${rec.ref}]`, html, rec.email));
  return json({ ok: true, ref: rec.ref });
}
