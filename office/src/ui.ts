/* Page shell, styles, icons and small formatters for the RCO Back Office.
 * Server-rendered HTML, no framework. Built for three people who want big
 * buttons and plain words: one column on a phone, two on a laptop. */

export const esc = (v: unknown) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const TZ = 'America/Chicago';

/** Today's date in Central time, YYYY-MM-DD. */
export const todayCT = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d);

export function addDays(ymd: string, n: number): string {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** "Sat, Dec 12" (adds the year when it isn't this year). */
export function fmtDay(ymd: string | null | undefined): string {
  if (!ymd) return '';
  const d = new Date(`${ymd}T12:00:00Z`);
  const sameYear = ymd.slice(0, 4) === todayCT().slice(0, 4);
  return d.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric', ...(sameYear ? {} : { year: 'numeric' }) });
}

/** "Today 2:14 PM", "Yesterday 9:02 AM", "Nov 3, 4:10 PM". */
export function fmtWhen(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  const day = todayCT(d);
  const time = d.toLocaleTimeString('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' });
  if (day === todayCT()) return `Today ${time}`;
  if (day === addDays(todayCT(), -1)) return `Yesterday ${time}`;
  return `${d.toLocaleDateString('en-US', { timeZone: TZ, month: 'short', day: 'numeric' })}, ${time}`;
}

/** How long ago, in words a partner reads at a glance. */
export function ago(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return mins <= 1 ? 'just now' : `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}

/** "18:30" -> "6:30 PM". */
export function fmtTime(hm: string | null | undefined): string {
  const m = /^(\d{1,2}):(\d{2})/.exec(hm ?? '');
  if (!m) return hm ?? '';
  const h = Number(m[1]);
  return `${((h + 11) % 12) + 1}:${m[2]} ${h < 12 ? 'AM' : 'PM'}`;
}

export const money = (n: number | null | undefined) => (n == null ? '' : `$${Math.round(n).toLocaleString('en-US')}`);

export const digits = (p: string | null | undefined) => String(p ?? '').replace(/\D/g, '');

export function prettyPhone(p: string | null | undefined): string {
  const d = digits(p);
  const ten = d.length === 11 && d.startsWith('1') ? d.slice(1) : d;
  return ten.length === 10 ? `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}` : String(p ?? '');
}

/* ------------------------------------------------------------------ icons */
const P: Record<string, string> = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13L22 12v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  text: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  dollar: '<path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  note: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  back: '<path d="M15 18l-6-6 6-6"/>',
  next: '<path d="M9 18l6-6-6-6"/>',
  callback: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  pig: '<path d="M4 12a7 6 0 0 1 14 0v3a3 3 0 0 1-3 3H9a5 5 0 0 1-5-5z"/><path d="M18 11h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2"/><path d="M8 18v3M14 18v3M8 9l-2-3"/>',
};
export const icon = (name: string, size = 22) =>
  `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] ?? ''}</svg>`;

/* ----------------------------------------------------------- vocabulary */
export const LEAD_STATUS: Record<string, { label: string; tone: string }> = {
  new: { label: 'New', tone: 'red' },
  talked: { label: 'Talked to them', tone: 'amber' },
  booked: { label: 'Booked', tone: 'green' },
  lost: { label: 'Not booked', tone: 'gray' },
};
export const LEAD_KIND: Record<string, { label: string; tone: string; icon: string }> = {
  hunt: { label: 'Hunt', tone: 'green', icon: 'target' },
  trap: { label: 'Hog trapping', tone: 'red', icon: 'pig' },
  question: { label: 'Question', tone: 'gray', icon: 'text' },
};
export const HUNT_STATUS: Record<string, { label: string; tone: string }> = {
  scheduled: { label: 'Scheduled', tone: 'blue' },
  done: { label: 'Done', tone: 'green' },
  canceled: { label: 'Canceled', tone: 'gray' },
};
export const DEPOSIT_STATE: Record<string, { label: string; tone: string }> = {
  due: { label: 'Deposit due', tone: 'amber' },
  paid: { label: 'Deposit paid', tone: 'green' },
  full: { label: 'Paid in full', tone: 'green' },
};
/** One color per hunt type, used on the calendar and hunt cards. */
export const HUNT_COLOR: Record<string, string> = {
  'thermal-hog': '#c1282c',
  'thermal-predator': '#7a3f9e',
  'whitetail-doe': '#b8863b',
  'whitetail-buck': '#7a4b22',
  dove: '#4d7fb0',
  teal: '#16878a',
  duck: '#2f6b3a',
  goose: '#5d5a58',
  corporate: '#c78a00',
};

export const chip = (label: string, tone: string) => `<span class="chip ${tone}">${esc(label)}</span>`;

/* ------------------------------------------------------------- layout */
const NAV = [
  { href: '/', label: 'Today', icon: 'home' },
  { href: '/leads', label: 'Leads', icon: 'inbox' },
  { href: '/calendar', label: 'Calendar', icon: 'calendar' },
  { href: '/online', label: 'Web & Social', icon: 'chart' },
  { href: '/activity', label: 'Who did what', icon: 'clock' },
];

export function page(opts: { title: string; user: { name: string }; active?: string; body: string; flash?: string }): Response {
  const { title, user, active = '', body, flash } = opts;
  const nav = NAV.map(
    (n) => `<a href="${n.href}" class="${active === n.href ? 'on' : ''}"${active === n.href ? ' aria-current="page"' : ''}>${icon(n.icon, 24)}<span>${esc(n.label)}</span></a>`
  ).join('');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#1f1e1e">
<title>${esc(title)} · RCO Back Office</title>
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#c1282c"/><text x="16" y="22" font-family="Arial" font-weight="700" font-size="13" fill="#fff" text-anchor="middle">RCO</text></svg>')}">
<style>${CSS}</style></head><body>
<header class="top"><div class="bar">
  <a class="brand" href="/"><span class="mark">RCO</span><span class="bt">Back Office</span></a>
  <nav class="topnav">${nav}</nav>
  <span class="who">${icon('user', 18)}${esc(user.name)}</span>
</div></header>
<main class="wrap">${flash ? `<div class="flash" role="status">${icon('check', 20)}${esc(flash)}</div>` : ''}${body}</main>
<nav class="tabbar">${nav}</nav>
<script>${JS}</script>
</body></html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-frame-options': 'DENY', 'referrer-policy': 'same-origin' } });
}

export function message(title: string, text: string, status = 200): Response {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(title)}</title><style>${CSS}</style></head><body><main class="wrap"><div class="card" style="margin-top:15vh;text-align:center"><p class="eyebrow">RCO Back Office</p><h1>${esc(title)}</h1><p>${esc(text)}</p></div></main></body></html>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }
  );
}

/** Tiny browser helpers: the deposit line on the hunt form, and stopping a double tap from posting twice. */
const JS = `
document.addEventListener('submit',function(e){var b=e.target.querySelector('button[type=submit]:not([formaction])');if(e.submitter){e.submitter.disabled=true;var h=document.createElement('input');h.type='hidden';h.name=e.submitter.name;h.value=e.submitter.value;if(e.submitter.name)e.target.appendChild(h)}});
var t=document.querySelector('[data-total]');if(t){var o=document.querySelector('[data-half]');var f=function(){var v=parseInt(t.value.replace(/[^0-9]/g,''),10);o.textContent=v>0?'$'+Math.round(v/2).toLocaleString('en-US'):'half the total'};t.addEventListener('input',f);f()}
var g=document.querySelector('[data-guns]'),ty=document.querySelector('[data-type]');if(g&&ty&&t){var s=function(){var p=parseInt((ty.selectedOptions[0]||{}).dataset.each||'0',10),n=parseInt(g.value||'0',10);if(p>0&&n>0&&!t.dataset.touched){t.value=p*n;t.dispatchEvent(new Event('input'))}};g.addEventListener('input',s);ty.addEventListener('change',s);t.addEventListener('keydown',function(){t.dataset.touched=1})}
`;

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
:root{--red:#c1282c;--ink:#1f1e1e;--muted:#5d5a58;--line:#ddd7cf;--bg:#f4f1ec;--card:#fff;--green:#2f7a3a;--amber:#b36b00;--blue:#2c5f99;--gray:#6b6764}
html{-webkit-text-size-adjust:100%}
body{font:17px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:var(--ink);background:var(--bg);padding-bottom:84px}
a{color:inherit}
h1{font-size:26px;line-height:1.2;margin:0 0 6px}
h2{font-size:19px;margin:0 0 12px;display:flex;align-items:center;gap:8px}
p{margin:0 0 10px}
.ic{flex:none;vertical-align:middle}
.top{background:var(--ink);color:#fff;position:sticky;top:0;z-index:5}
.bar{max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:16px;padding:10px 16px}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;font-weight:700;font-size:18px}
.mark{background:var(--red);border-radius:8px;padding:5px 8px;font-size:15px;letter-spacing:.04em}
.who{margin-left:auto;display:flex;align-items:center;gap:6px;font-size:15px;color:#d8d3cc}
.topnav{display:none}
.tabbar{position:fixed;left:0;right:0;bottom:0;z-index:5;background:#fff;border-top:1px solid var(--line);display:grid;grid-template-columns:repeat(5,1fr);padding-bottom:env(safe-area-inset-bottom)}
.tabbar a{display:flex;flex-direction:column;align-items:center;gap:2px;padding:9px 1px 8px;font-size:11px;text-align:center;line-height:1.2;font-weight:600;text-decoration:none;color:var(--muted)}
.tabbar a.on{color:var(--red)}
@media (min-width:860px){
  body{padding-bottom:40px}
  .tabbar{display:none}
  .topnav{display:flex;gap:4px;margin-left:24px}
  .topnav a{display:flex;align-items:center;gap:7px;padding:9px 14px;border-radius:10px;text-decoration:none;font-weight:600;font-size:16px;color:#d8d3cc}
  .topnav a.on,.topnav a:hover{background:#3a3837;color:#fff}
}
.wrap{max-width:1100px;margin:0 auto;padding:18px 16px}
.eyebrow{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--red);margin-bottom:4px}
.sub{color:var(--muted);font-size:15px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;margin-bottom:16px}
.grid2{display:grid;gap:16px}
@media (min-width:860px){.grid2{grid-template-columns:1fr 1fr;align-items:start}}
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0}
@media (min-width:860px){.tiles{grid-template-columns:repeat(4,1fr)}}
.tile{display:block;text-decoration:none;border-radius:14px;padding:16px;color:#fff;min-height:108px;position:relative}
.tile .n{font-size:38px;font-weight:800;line-height:1}
.tile .l{font-size:16px;font-weight:600;margin-top:6px}
.tile .ic{position:absolute;right:14px;top:14px;opacity:.85}
.tile.red{background:var(--red)}.tile.amber{background:var(--amber)}.tile.green{background:var(--green)}.tile.blue{background:var(--blue)}
.tile.zero{background:#fff;color:var(--muted);border:1px solid var(--line)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:52px;padding:12px 18px;border-radius:12px;border:2px solid transparent;font-family:inherit;font-weight:700;font-size:17px;line-height:1.2;text-decoration:none;cursor:pointer;background:var(--ink);color:#fff}
.btn.red{background:var(--red)}.btn.green{background:var(--green)}.btn.amber{background:var(--amber)}.btn.blue{background:var(--blue)}
.btn.ghost{background:#fff;color:var(--ink);border-color:var(--line)}
.btn.small{min-height:44px;padding:8px 14px;font-size:16px}
.btn:disabled{opacity:.55}
.btns{display:flex;flex-wrap:wrap;gap:10px}
.btns.full>*{flex:1 1 140px}
.actions{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0}
.actions .btn{flex-direction:column;gap:4px;min-height:72px;font-size:15px}
.chip{display:inline-block;padding:4px 10px;border-radius:999px;font-size:14px;font-weight:700;white-space:nowrap}
.chip.red{background:#fbe3e3;color:#9c1c20}.chip.amber{background:#fdefd6;color:#8a5200}.chip.green{background:#dff1e2;color:#1f5d29}.chip.blue{background:#e1ecf8;color:#1f4a7a}.chip.gray{background:#ecebe9;color:#4d4a48}
.list{list-style:none}
.row{display:flex;gap:12px;align-items:center;padding:14px 0;border-top:1px solid var(--line);text-decoration:none}
.list>li:first-child .row,.list>li:first-child>.row{border-top:0}
.row .main{flex:1;min-width:0}
.row .t{font-weight:700;font-size:18px;overflow-wrap:anywhere}
.row .s{color:var(--muted);font-size:15px}
.row .go{color:var(--muted)}
.dot{width:14px;height:14px;border-radius:50%;flex:none}
.badge{width:46px;height:46px;border-radius:12px;display:grid;place-items:center;color:#fff;flex:none}
.empty{color:var(--muted);padding:6px 0 2px}
.filters{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;margin:12px 0}
.filters a{flex:none;padding:10px 16px;border-radius:999px;background:#fff;border:1px solid var(--line);text-decoration:none;font-weight:700;font-size:16px}
.filters a.on{background:var(--ink);color:#fff;border-color:var(--ink)}
.head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:6px}
.backlink{display:inline-flex;align-items:center;gap:4px;color:var(--muted);text-decoration:none;font-weight:600;margin-bottom:10px}
dl.kv{display:grid;grid-template-columns:minmax(110px,34%) 1fr;gap:8px 14px}
dl.kv dt{color:var(--muted);font-size:15px}
dl.kv dd{font-weight:600;overflow-wrap:anywhere;white-space:pre-wrap}
form .f{margin-bottom:14px}
label.l{display:block;font-weight:700;margin-bottom:6px}
.hint{color:var(--muted);font-size:14px;margin-top:4px}
input[type=text],input[type=tel],input[type=email],input[type=date],input[type=time],input[type=number],input[type=search],select,textarea{width:100%;font:inherit;font-size:17px;padding:12px;border:2px solid var(--line);border-radius:10px;background:#fff;color:var(--ink);min-height:52px}
textarea{min-height:96px}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--blue)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.choice{display:flex;flex-wrap:wrap;gap:8px}
.choice label{display:flex;align-items:center;gap:8px;padding:12px 14px;border:2px solid var(--line);border-radius:10px;background:#fff;font-weight:600;cursor:pointer}
.choice input{width:20px;height:20px}
.choice label:has(input:checked){border-color:var(--blue);background:#eef4fb}
.flash{display:flex;align-items:center;gap:8px;background:#dff1e2;color:#1f5d29;border-radius:12px;padding:12px 14px;font-weight:700;margin-bottom:14px}
.feed li{padding:12px 0;border-top:1px solid var(--line)}
.feed li:first-child{border-top:0}
.feed .w{font-weight:700}
.feed .when{color:var(--muted);font-size:14px}
.feed .note{background:var(--bg);border-radius:10px;padding:10px 12px;margin-top:6px;white-space:pre-wrap}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.cal .dow{font-size:13px;font-weight:700;color:var(--muted);text-align:center;padding:4px 0}
.cal .day{background:#fff;border:1px solid var(--line);border-radius:10px;min-height:64px;padding:5px;text-decoration:none;display:flex;flex-direction:column;gap:3px}
.cal .day.out{opacity:.4}
.cal .day.today{border:2px solid var(--red)}
.cal .num{font-size:14px;font-weight:700}
.cal .pill{display:block;border-radius:6px;color:#fff;font-size:12px;font-weight:700;padding:2px 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media (max-width:600px){.cal .pill{font-size:0;height:8px;padding:0}.cal .day{min-height:52px}}
@media (min-width:860px){.cal .day{min-height:104px}}
.legend{display:flex;flex-wrap:wrap;gap:10px 16px;margin-top:12px;font-size:14px;color:var(--muted)}
.legend span{display:flex;align-items:center;gap:6px}
.monthnav{display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:8px;margin:10px 0 14px}
.monthnav .btn{padding:8px 6px}
.big{font-size:22px;font-weight:800}
details.more summary{cursor:pointer;font-weight:700;color:var(--blue);padding:6px 0;list-style:none}
details.more summary::-webkit-details-marker{display:none}
.search{display:flex;gap:8px;margin:12px 0}
.search input{flex:1}
`;
