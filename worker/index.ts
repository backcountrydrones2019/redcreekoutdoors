/* Red Creek Outdoors site Worker.
 *
 * Static assets answer every page. The Worker runs first only for /api/*
 * (wrangler.jsonc run_worker_first), so a plain HTML form post reaches it.
 *
 *   POST /api/request   booking and trapping requests from /contact
 *
 * Mail: the zone's DMARC is p=reject. Anything claiming to be from
 * @redcreekoutdoors.com that isn't aligned gets dropped by the receiving
 * server, silently. So the notification is sent through Resend from the
 * SUBDOMAIN send.redcreekoutdoors.com, which carries its own DKIM and MX for
 * bounces and stays clear of the Google Workspace MX on the apex. Same setup
 * as backcountrydrones.com.
 *
 * Every lead is written to KV (binding LEADS) BEFORE the email is attempted,
 * so a mail outage never loses a request. The ops console reads from there.
 */

interface Env {
  ASSETS: Fetcher;
  LEADS?: KVNamespace;
  RESEND_API_KEY?: string; // secret: npx wrangler secret put RESEND_API_KEY
  MAIL_TO: string;
  MAIL_FROM: string;
  BUILD_SHA?: string;
}

type Lead = {
  ref: string;
  received: string;
  kind: 'hunt' | 'trapping' | 'corporate' | 'survey' | 'other';
  name: string;
  phone: string;
  email: string;
  interest: string;
  when: string;
  party: string;
  location: string;
  acreage: string;
  message: string;
  landing: string;
  referrer: string;
  ip_country: string;
};

const KINDS = new Set(['hunt', 'trapping', 'corporate', 'survey', 'other']);

function field(fd: FormData, name: string, max = 600): string {
  const v = fd.get(name);
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function makeRef(now: Date): string {
  const d = now.toISOString().slice(2, 10).replace(/-/g, '');
  const r = crypto.getRandomValues(new Uint16Array(1))[0] % 10000;
  return `RC-${d}-${String(r).padStart(4, '0')}`;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function back(to: string): Response {
  return new Response(null, { status: 303, headers: { location: to, 'cache-control': 'no-store' } });
}

async function handleRequest(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { allow: 'POST' } });

  const ct = request.headers.get('content-type') || '';
  if (!ct.includes('form')) return new Response('Bad request', { status: 400 });
  const fd = await request.formData();

  // Honeypot: a field people never see. Bots fill it. Pretend it worked.
  if (field(fd, 'website')) return back('/thanks');

  const lead: Lead = {
    ref: makeRef(new Date()),
    received: new Date().toISOString(),
    kind: (KINDS.has(field(fd, 'kind')) ? field(fd, 'kind') : 'other') as Lead['kind'],
    name: field(fd, 'name', 120),
    phone: field(fd, 'phone', 40),
    email: field(fd, 'email', 160),
    interest: field(fd, 'interest', 120),
    when: field(fd, 'when', 160),
    party: field(fd, 'party', 40),
    location: field(fd, 'location', 160),
    acreage: field(fd, 'acreage', 40),
    message: field(fd, 'message', 4000),
    landing: field(fd, 'landing', 300),
    referrer: field(fd, 'referrer', 300),
    ip_country: request.headers.get('cf-ipcountry') || '',
  };

  if (!lead.name || (!lead.phone && !lead.email)) return back('/contact?missing=1#request');

  if (env.LEADS) {
    await env.LEADS.put(`lead:${lead.ref}`, JSON.stringify(lead), { metadata: { kind: lead.kind, received: lead.received } });
  }

  ctx.waitUntil(notify(lead, env));
  return back(`/thanks?ref=${encodeURIComponent(lead.ref)}`);
}

async function notify(lead: Lead, env: Env): Promise<void> {
  if (!env.RESEND_API_KEY || !env.MAIL_TO) {
    console.warn('lead stored without email: RESEND_API_KEY or MAIL_TO not set', lead.ref);
    return;
  }
  const label = { hunt: 'Hunt request', trapping: 'Trapping request', corporate: 'Corporate event', survey: 'Wildlife survey', other: 'Request' }[lead.kind];
  const rows: [string, string][] = [
    ['Name', lead.name], ['Phone', lead.phone], ['Email', lead.email], ['Interested in', lead.interest],
    ['When', lead.when], ['Party size', lead.party], ['Where', lead.location], ['Acreage', lead.acreage],
    ['Message', lead.message], ['Landed on', lead.landing], ['Came from', lead.referrer], ['Ref', lead.ref],
  ];
  const html = `<h2 style="font-family:sans-serif">${esc(label)}: ${esc(lead.name)}</h2>
    ${lead.phone ? `<p><a href="tel:${esc(lead.phone.replace(/[^\d+]/g, ''))}" style="font-size:18px">Call ${esc(lead.phone)}</a></p>` : ''}
    <table cellpadding="6" style="font-family:sans-serif;border-collapse:collapse">${rows
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><th align="left" valign="top">${esc(k)}</th><td>${esc(v).replace(/\n/g, '<br>')}</td></tr>`)
      .join('')}</table>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: env.MAIL_TO.split(',').map((s) => s.trim()).filter(Boolean),
      reply_to: lead.email || undefined,
      subject: `${label}: ${lead.name}${lead.interest ? `, ${lead.interest}` : ''} [${lead.ref}]`,
      html,
    }),
  });
  if (!res.ok) console.error('resend failed', res.status, await res.text(), lead.ref);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/request') return handleRequest(request, env, ctx);
    if (url.pathname === '/api/health') return Response.json({ ok: true, build: env.BUILD_SHA || 'local' });
    if (url.pathname.startsWith('/api/')) return new Response('Not found', { status: 404 });
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
