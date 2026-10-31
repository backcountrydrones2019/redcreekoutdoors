/* Email helpers. Ported from backcountrydrones.com worker/index.ts (2026-10-31)
 * so Red Creek intake mail matches BCD's: a full HTML document with a
 * plain-text part (HTML-only mail looks like bulk mail to filters on a young
 * sending domain), a phone-friendly one-column layout, and a customer receipt
 * that never promises a response time.
 */
import { SITE, DEPOSIT } from '../src/consts';

export const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Mobile apps that honor media queries stack the label/value table. Outlook keeps the desktop layout. */
export function emailDoc(inner: string): string {
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
@media only screen and (max-width:480px){
  .rc-t td{display:block !important;width:auto !important;padding:2px 0 !important;word-break:normal !important}
  .rc-t td:first-child{padding-top:12px !important}
  .rc-t td[colspan]{padding-top:16px !important}
}
</style></head><body style="margin:0;padding:0;background:#f4f1ec">${inner}</body></html>`;
}

export function plain(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|h1|h2|h3|li|span)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&middot;/g, '·')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((l) => l.trim())
    .join('\n')
    .trim();
}

export const firstNameOf = (v: unknown) => String(v ?? '').trim().split(/\s+/)[0] || 'there';
export const mapsLink = (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

/** Centroid of a ring, good enough to drop a pin on a shaded area. */
export function centroid(points: [number, number][]): [number, number] | null {
  if (!points.length) return null;
  let la = 0, ln = 0;
  for (const [a, b] of points) { la += a; ln += b; }
  return [+(la / points.length).toFixed(6), +(ln / points.length).toFixed(6)];
}

/** Where the lead came from: first-touch source plus landing page (public/js/attribution.js). '' when unknown. */
export function sourceLine(raw: unknown): string {
  const a = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const str = (v: unknown, n = 200) => String(v ?? '').trim().slice(0, n);
  if (!Object.keys(a).length) return '';
  const bits: string[] = [];
  const utmSource = str(a.utm_source, 60);
  const refHost = str(a.referrerHost, 120);
  if (utmSource) {
    const medium = str(a.utm_medium, 60);
    const campaign = str(a.utm_campaign, 80);
    bits.push(`${utmSource}${medium ? ` / ${medium}` : ''}${campaign ? ` / ${campaign}` : ''}`.toUpperCase());
  } else if (a.gclid) bits.push('GOOGLE ADS');
  else if (a.fbclid) bits.push('FACEBOOK');
  else if (refHost) bits.push(refHost);
  else bits.push('Direct or untracked');
  const landing = str(a.landing, 200);
  const from = str(a.submittedFrom, 200);
  if (landing) bits.push(`landed on ${landing}`);
  if (from && from !== landing.split('?')[0]) bits.push(`submitted from ${from}`);
  return bits.join(' | ');
}

/* Ops email table pieces, same look as BCD's hog assessment email in Red Creek colors. */
export const row = (label: string, value: string) =>
  value
    ? `<tr><td style="width:38%;padding:7px 12px 7px 0;color:#5d5a58;font:600 12px/1.4 -apple-system,sans-serif;text-transform:uppercase;letter-spacing:.02em;vertical-align:top;word-break:normal">${esc(label)}</td><td style="padding:7px 0;color:#232222;font:400 15px/1.5 -apple-system,sans-serif">${esc(value).replace(/\n/g, '<br>')}</td></tr>`
    : '';
export const linkRow = (label: string, href: string, text: string) =>
  `<tr><td style="width:38%;padding:6px 12px 6px 0;color:#5d5a58;font:600 12px/1.4 -apple-system,sans-serif;word-break:break-word">${esc(label)}</td><td style="padding:6px 0;font:400 14px/1.5 -apple-system,sans-serif"><a href="${esc(href)}" style="color:#c1282c">${esc(text)}</a></td></tr>`;
export const section = (t: string) =>
  `<tr><td colspan="2" style="padding:16px 0 4px;border-top:1px solid #ddd7cf;color:#c1282c;font:700 11px/1 -apple-system,sans-serif;letter-spacing:.12em;text-transform:uppercase">${esc(t)}</td></tr>`;

export function opsDoc(eyebrow: string, name: string, ref: string, rows: string): string {
  return `<div style="width:100%;max-width:600px;margin:0 auto;padding:16px;background:#f4f1ec">
  <p style="margin:0 0 4px;font:700 11px/1 -apple-system,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#c1282c">${esc(eyebrow)}</p>
  <h1 style="margin:0 0 4px;font:700 22px/1.2 -apple-system,sans-serif;color:#1f1e1e">${esc(name)}</h1>
  <p style="margin:0 0 20px;font:400 13px/1.4 -apple-system,sans-serif;color:#5d5a58">${esc(ref)}</p>
  <table width="100%" class="rc-t" style="width:100%;max-width:100%;border-collapse:collapse;table-layout:fixed;background:#fff;border:1px solid #ddd7cf;border-radius:8px">${rows}</table>
  <p style="margin:20px 0 0;font:400 13px/1.5 -apple-system,sans-serif;color:#5d5a58">Sent from redcreekoutdoors.com &middot; ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT</p>
</div>`;
}

/**
 * Customer receipt. Same rules as BCD's:
 * NO PROMISED RESPONSE TIME, EVER. "We will come back to you" is true; a
 * number of minutes is a promise somebody gets held to.
 * One column, fluid width, nothing that needs a media query (Outlook on a phone).
 */
export function receiptHtml(opts: { firstName: string; headline: string; body: string; ref?: string; refLabel?: string; extraHtml?: string }): string {
  const { firstName, headline, body, ref, refLabel = 'Reference', extraHtml = '' } = opts;
  return `<div style="width:100%;max-width:600px;margin:0 auto;padding:16px;background:#f4f1ec;font:400 15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#232222">
  <div style="background:#fff;border:1px solid #ddd7cf;border-top:4px solid #c1282c;padding:20px">
    <p style="margin:0 0 6px;font:700 11px/1.3 -apple-system,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#c1282c">Red Creek Outdoors</p>
    <h1 style="margin:0 0 14px;font:700 21px/1.25 -apple-system,sans-serif">${esc(headline)}</h1>
    <p style="margin:0 0 14px">${esc(firstName)}, ${esc(body)}</p>
    ${ref ? `<p style="margin:0 0 14px;padding:12px;background:#f4f1ec;border-left:3px solid #c1282c;word-break:break-word"><span style="display:block;font:600 11px/1.3 -apple-system,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#5d5a58">${esc(refLabel)}</span><strong style="font-size:18px">${esc(ref)}</strong></p>` : ''}
    <p style="margin:0 0 14px">Expect to hear from us. If hogs are in a crop or after livestock right now, call <a href="tel:${SITE.phoneE164}" style="color:#c1282c">${SITE.phone}</a> rather than waiting on this email.</p>
    ${extraHtml}
    <p style="margin:0 0 14px;font-size:13px;color:#5d5a58">If this landed in Spam or Junk, marking it "not spam" once keeps the rest of our messages out of there.</p>
    <p style="margin:14px 0 0;padding-top:14px;border-top:1px solid #ddd7cf;font-size:13px;color:#5d5a58">
      Your phone number and email are used to work with you and to contact you about our services.
      <strong>We do not sell or trade your information to data brokers, marketers, or anyone else, ever.</strong>
      Tell us to stop contacting you and we stop.
    </p>
  </div>
</div>`;
}

/** The deposit rule for a trapping job, matching the acknowledgment the landowner checked on the form. */
export const depositNote = () =>
  `<p style="margin:0 0 14px;padding:12px;border:2px solid #343333">Once we confirm we can schedule your site assessment, a ${esc(DEPOSIT.text)} nonrefundable deposit is due to lock it in. Nothing is owed until we confirm.</p>`;

export interface MailEnv {
  RESEND_API_KEY?: string;
  MAIL_TO: string;
  MAIL_FROM: string;
}

/** Ops copy. Returns whether Resend took it, so the caller can tell the visitor to call instead. */
export async function sendOps(env: MailEnv, subject: string, inner: string, replyTo?: string): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.MAIL_TO) {
    console.warn('stored without email: RESEND_API_KEY or MAIL_TO not set:', subject);
    return true; // stored is not failed; nothing for the visitor to act on
  }
  const html = emailDoc(inner);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, to: env.MAIL_TO.split(',').map((x) => x.trim()).filter(Boolean), reply_to: replyTo || undefined, subject, html, text: plain(html) }),
  });
  if (!res.ok) console.error('resend failed (ops)', res.status, await res.text());
  return res.ok;
}

/** Customer receipt, fire and forget but kept alive with waitUntil. Bad addresses are skipped. */
export function sendReceipt(ctx: ExecutionContext, env: MailEnv, to: unknown, subject: string, inner: string): void {
  const addr = String(to ?? '').trim();
  if (!env.RESEND_API_KEY || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(addr)) return;
  const html = emailDoc(inner);
  ctx.waitUntil(
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: env.MAIL_FROM, to: [addr], reply_to: env.MAIL_TO.split(',')[0].trim(), subject, html, text: plain(html) }),
    })
      .then((r) => { if (!r.ok) console.error('receipt rejected', addr, r.status); })
      .catch((err) => console.error('receipt send failed', addr, err))
  );
}
