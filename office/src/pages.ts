/* Every screen in the RCO Back Office. Each function takes rows and returns the
 * page body; index.ts does the reading and writing. Plain words on every
 * button, one obvious next step per screen. */
import { HUNT_OPTIONS } from '../../src/data/hunt-booking';
import { PRICES, SITE } from '../../src/consts';
import {
  esc, icon, chip, fmtDay, fmtWhen, fmtTime, ago, money, digits, prettyPhone, todayCT, addDays,
  LEAD_STATUS, LEAD_KIND, HUNT_STATUS, DEPOSIT_STATE, HUNT_COLOR,
} from './ui';

export type Lead = { id: string; kind: string; name: string; phone: string | null; email: string | null; summary: string | null; details: string | null; status: string; source: string; created_at: string; updated_at: string; created_by: string };
export type Hunt = { id: number; lead_id: string | null; client: string; phone: string | null; email: string | null; hunt_type: string; date: string; start_time: string | null; town: string | null; guns: number | null; total: number | null; deposit: string; guide: string | null; status: string; hogs: number | null; deer: number | null; other_game: number | null; result_notes: string | null; notes: string | null; created_at: string; updated_at: string; created_by: string };
export type Callback = { id: number; lead_id: string | null; hunt_id: number | null; due: string; note: string; done_at: string | null; done_by: string | null; created_at: string; created_by: string; who_name?: string | null };
export type Activity = { id: number; at: string; who: string; lead_id: string | null; hunt_id: number | null; kind: string; text: string; label?: string | null };

export const TOWNS = ['Salado', 'Holland', 'Gatesville', 'Marlin', 'Rogers'];

const huntLabel = (v: string) => HUNT_OPTIONS.find((h) => h.value === v)?.label ?? v;
const color = (v: string) => HUNT_COLOR[v] ?? '#5d5a58';

/** Per-gun list price for the hunt types priced per gun or per person, so the form can suggest a total. */
const EACH: Record<string, number> = { dove: PRICES.dove.amount, teal: PRICES.teal.amount, duck: PRICES.duck.amount, goose: PRICES.goose.amount };

/* ------------------------------------------------------------ pieces */
function contactButtons(phone: string | null, email: string | null): string {
  const d = digits(phone);
  return `<div class="actions">
    ${d ? `<a class="btn green" href="tel:${d}">${icon('phone', 26)}Call</a>` : `<span class="btn ghost" aria-disabled="true">${icon('phone', 26)}No phone</span>`}
    ${d ? `<a class="btn blue" href="sms:${d}">${icon('text', 26)}Text</a>` : `<span class="btn ghost" aria-disabled="true">${icon('text', 26)}No phone</span>`}
    ${email ? `<a class="btn" href="mailto:${esc(email)}">${icon('mail', 26)}Email</a>` : `<span class="btn ghost" aria-disabled="true">${icon('mail', 26)}No email</span>`}
  </div>`;
}

function leadRow(l: Lead): string {
  const k = LEAD_KIND[l.kind] ?? LEAD_KIND.question;
  const st = LEAD_STATUS[l.status] ?? LEAD_STATUS.new;
  const tone = { green: 'var(--green)', red: 'var(--red)', gray: 'var(--gray)' }[k.tone] ?? 'var(--gray)';
  return `<li><a class="row" href="/lead/${encodeURIComponent(l.id)}">
    <span class="badge" style="background:${tone}">${icon(k.icon, 24)}</span>
    <span class="main"><span class="t">${esc(l.name)}</span><br><span class="s">${esc(l.summary || k.label)}</span><br><span class="s">${esc(ago(l.created_at))}</span></span>
    ${chip(st.label, st.tone)}
  </a></li>`;
}

function huntRow(h: Hunt, showDate = true): string {
  const dep = DEPOSIT_STATE[h.deposit] ?? DEPOSIT_STATE.due;
  const st = HUNT_STATUS[h.status] ?? HUNT_STATUS.scheduled;
  return `<li><a class="row" href="/hunt/${h.id}">
    <span class="badge" style="background:${color(h.hunt_type)}">${icon(h.hunt_type === 'thermal-hog' ? 'pig' : 'target', 24)}</span>
    <span class="main"><span class="t">${esc(h.client)}</span><br>
      <span class="s">${esc(huntLabel(h.hunt_type))}${h.guns ? ` · ${h.guns} gun${h.guns === 1 ? '' : 's'}` : ''}${h.town ? ` · ${esc(h.town)}` : ''}</span><br>
      <span class="s">${showDate ? `${esc(fmtDay(h.date))}${h.start_time ? ` at ${esc(fmtTime(h.start_time))}` : ''}` : esc(fmtTime(h.start_time))}${h.guide ? ` · Guide: ${esc(h.guide)}` : ''}</span></span>
    ${h.status === 'scheduled' ? chip(dep.label, dep.tone) : chip(st.label, st.tone)}
  </a></li>`;
}

function callbackRow(c: Callback & { name?: string; phone?: string | null }, overdue: boolean): string {
  const target = c.hunt_id ? `/hunt/${c.hunt_id}` : c.lead_id ? `/lead/${encodeURIComponent(c.lead_id)}` : '#';
  const d = digits(c.phone);
  return `<li><div class="row">
    <span class="badge" style="background:${overdue ? 'var(--red)' : 'var(--amber)'}">${icon('callback', 24)}</span>
    <a class="main" href="${target}" style="text-decoration:none"><span class="t">${esc(c.name ?? 'Call back')}</span><br><span class="s">${esc(c.note)}</span><br><span class="s">${overdue ? `<b style="color:var(--red)">Was due ${esc(fmtDay(c.due))}</b>` : `Due ${esc(fmtDay(c.due))}`} · set by ${esc(c.created_by)}</span></a>
    <span class="btns" style="flex-direction:column">
      ${d ? `<a class="btn green small" href="tel:${d}">${icon('phone', 18)}Call</a>` : ''}
      <form method="post" action="/callback/${c.id}/done"><button class="btn ghost small" type="submit">${icon('check', 18)}Done</button></form>
    </span>
  </div></li>`;
}

function feed(items: Activity[], withLinks = false): string {
  if (!items.length) return `<p class="empty">Nothing yet.</p>`;
  return `<ul class="list feed">${items.map((a) => {
    const link = withLinks ? (a.hunt_id ? `/hunt/${a.hunt_id}` : a.lead_id ? `/lead/${encodeURIComponent(a.lead_id)}` : '') : '';
    return `<li><span class="w">${esc(a.who)}</span> <span class="when">· ${esc(fmtWhen(a.at))}</span>
      ${a.kind === 'note' ? `<div class="note">${esc(a.text)}</div>` : `<div>${esc(a.text)}</div>`}
      ${link && a.label ? `<a class="sub" href="${link}">${esc(a.label)} ${icon('next', 14)}</a>` : ''}</li>`;
  }).join('')}</ul>`;
}

function noteForm(action: string): string {
  return `<form method="post" action="${action}">
    <div class="f"><label class="l" for="note">Add a note</label><textarea id="note" name="note" required placeholder="What happened? What did they say?"></textarea></div>
    <button class="btn" type="submit">${icon('note')}Save note</button></form>`;
}

function callbackForm(action: string): string {
  const t = todayCT();
  return `<form method="post" action="${action}">
    <div class="f"><label class="l" for="cbnote">Why call back?</label><input id="cbnote" type="text" name="note" placeholder="Check if they picked a date" required></div>
    <p class="l" style="font-weight:700;margin-bottom:8px">When?</p>
    <div class="btns full">
      <button class="btn amber" type="submit" name="due" value="${addDays(t, 1)}">Tomorrow</button>
      <button class="btn amber" type="submit" name="due" value="${addDays(t, 3)}">In 3 days</button>
      <button class="btn amber" type="submit" name="due" value="${addDays(t, 7)}">Next week</button>
    </div>
    <details class="more" style="margin-top:10px"><summary>Pick a date</summary>
      <div class="two" style="margin-top:8px"><input type="date" name="due_pick" min="${t}"><button class="btn amber" type="submit" name="due" value="pick">Set</button></div>
    </details></form>`;
}

/* ------------------------------------------------------------- Today */
export function todayBody(d: {
  name: string; newLeads: Lead[]; dueCalls: (Callback & { name?: string; phone?: string | null })[]; weekHunts: Hunt[]; depositsDue: number; toLog: Hunt[];
}): string {
  const t = todayCT();
  const greet = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', hour: 'numeric', hour12: false });
  const h = Number(greet);
  const hello = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const tile = (href: string, n: number, label: string, tone: string, ic: string) =>
    `<a class="tile ${n ? tone : 'zero'}" href="${href}">${icon(ic, 28)}<div class="n">${n}</div><div class="l">${label}</div></a>`;
  const overdue = d.dueCalls.filter((c) => c.due < t);
  return `
  <p class="eyebrow">${esc(new Date().toLocaleDateString('en-US', { timeZone: 'America/Chicago', weekday: 'long', month: 'long', day: 'numeric' }))}</p>
  <h1>${hello}, ${esc(d.name)}</h1>
  <div class="tiles">
    ${tile('/leads', d.newLeads.length, d.newLeads.length === 1 ? 'New lead' : 'New leads', 'red', 'inbox')}
    ${tile('#calls', d.dueCalls.length, d.dueCalls.length === 1 ? 'Call back today' : 'Call backs today', 'amber', 'callback')}
    ${tile('/calendar', d.weekHunts.length, d.weekHunts.length === 1 ? 'Hunt this week' : 'Hunts this week', 'green', 'calendar')}
    ${tile('/hunts?show=deposit', d.depositsDue, d.depositsDue === 1 ? 'Deposit due' : 'Deposits due', 'blue', 'dollar')}
  </div>
  <div class="btns full" style="margin-bottom:18px">
    <a class="btn red" href="/hunts/new">${icon('plus')}Book a hunt</a>
    <a class="btn" href="/leads/new">${icon('plus')}Add a lead</a>
  </div>
  ${d.toLog.length ? `<section class="card" style="border-color:var(--amber)"><h2>${icon('note')}Log how these went</h2><p class="sub">These hunts are past their date. Tap one and press <b>Hunt is done</b>.</p><ul class="list">${d.toLog.map((x) => huntRow(x)).join('')}</ul></section>` : ''}
  <div class="grid2">
    <section class="card" id="calls"><h2>${icon('callback')}Call backs</h2>
      ${d.dueCalls.length ? `${overdue.length ? `<p class="sub" style="color:var(--red);font-weight:700">${overdue.length} overdue</p>` : ''}<ul class="list">${d.dueCalls.map((c) => callbackRow(c, c.due < t)).join('')}</ul>` : `<p class="empty">No call backs due. Nice.</p>`}
    </section>
    <section class="card"><h2>${icon('inbox')}New leads</h2>
      ${d.newLeads.length ? `<p class="sub">Nobody has talked to these people yet.</p><ul class="list">${d.newLeads.slice(0, 8).map(leadRow).join('')}</ul>${d.newLeads.length > 8 ? `<a class="btn ghost small" href="/leads">See all ${d.newLeads.length}</a>` : ''}` : `<p class="empty">No new leads waiting.</p>`}
    </section>
  </div>
  <section class="card"><h2>${icon('calendar')}Next 7 days</h2>
    ${d.weekHunts.length ? `<ul class="list">${d.weekHunts.map((x) => huntRow(x)).join('')}</ul>` : `<p class="empty">No hunts on the books this week.</p>`}
    <a class="btn ghost small" href="/calendar">${icon('calendar', 18)}Open the calendar</a>
  </section>`;
}

/* ------------------------------------------------------------- Leads */
export const LEAD_FILTERS = [
  { key: 'new', label: 'New' }, { key: 'talked', label: 'Talked to them' }, { key: 'booked', label: 'Booked' }, { key: 'lost', label: 'Not booked' }, { key: 'all', label: 'All' },
];

export function leadsBody(show: string, leads: Lead[], counts: Record<string, number>, q: string): string {
  return `<div class="head"><h1>Leads</h1><a class="btn" href="/leads/new">${icon('plus')}Add a lead</a></div>
  <p class="sub">Everyone who reached out from the website, plus anyone you add by hand.</p>
  <form class="search" method="get" action="/leads"><input type="search" name="q" value="${esc(q)}" placeholder="Search name, phone or email" aria-label="Search leads"><button class="btn ghost" type="submit">${icon('search')}</button></form>
  <nav class="filters">${LEAD_FILTERS.map((f) => `<a href="/leads?show=${f.key}" class="${show === f.key && !q ? 'on' : ''}">${f.label}${counts[f.key] != null ? ` (${counts[f.key]})` : ''}</a>`).join('')}</nav>
  <section class="card">${leads.length ? `<ul class="list">${leads.map(leadRow).join('')}</ul>` : `<p class="empty">${q ? 'Nobody matches that search.' : 'Nobody here right now.'}</p>`}</section>`;
}

export function leadBody(l: Lead, hunts: Hunt[], calls: Callback[], acts: Activity[]): string {
  const k = LEAD_KIND[l.kind] ?? LEAD_KIND.question;
  const st = LEAD_STATUS[l.status] ?? LEAD_STATUS.new;
  let details: [string, string][] = [];
  try { details = JSON.parse(l.details || '[]'); } catch { /* shown as empty */ }
  const open = calls.filter((c) => !c.done_at);
  const statusBtn = (value: string, label: string, tone: string, ic: string) =>
    l.status === value ? '' : `<button class="btn ${tone}" type="submit" name="status" value="${value}">${icon(ic)}${label}</button>`;
  return `<a class="backlink" href="/leads">${icon('back', 18)}Leads</a>
  <div class="head"><div><p class="eyebrow">${esc(k.label)}${l.source === 'website' ? ' · from the website' : ''}</p><h1>${esc(l.name)}</h1></div>${chip(st.label, st.tone)}</div>
  <p class="sub">${esc(prettyPhone(l.phone))}${l.phone && l.email ? ' · ' : ''}${esc(l.email ?? '')}</p>
  ${contactButtons(l.phone, l.email)}
  <div class="grid2">
  <div>
    <section class="card"><h2>${icon('check')}What happened?</h2>
      <form method="post" action="/lead/${encodeURIComponent(l.id)}/status"><div class="btns full">
        ${statusBtn('talked', 'We talked', 'amber', 'phone')}
        ${statusBtn('lost', 'Not booking', 'ghost', 'x')}
        ${l.status !== 'new' ? statusBtn('new', 'Back to New', 'ghost', 'back') : ''}
      </div></form>
      <a class="btn red" style="width:100%;margin-top:10px" href="/hunts/new?lead=${encodeURIComponent(l.id)}">${icon('calendar')}${l.kind === 'trap' ? 'Put a job on the calendar' : 'Book their hunt'}</a>
    </section>
    ${hunts.length ? `<section class="card"><h2>${icon('calendar')}On the calendar</h2><ul class="list">${hunts.map((h) => huntRow(h)).join('')}</ul></section>` : ''}
    <section class="card"><h2>${icon('callback')}Call back</h2>
      ${open.length ? `<ul class="list">${open.map((c) => callbackRow({ ...c, name: c.note, phone: l.phone }, c.due < todayCT())).join('')}</ul><hr style="border:0;border-top:1px solid var(--line);margin:12px 0">` : ''}
      ${callbackForm(`/lead/${encodeURIComponent(l.id)}/callback`)}
    </section>
  </div>
  <div>
    <section class="card"><h2>${icon('note')}What they asked for</h2>
      ${details.length ? `<dl class="kv">${details.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${/^https?:\/\//.test(b) ? `<a href="${esc(b)}" target="_blank" rel="noopener">Open in Maps</a>` : esc(b)}</dd>`).join('')}</dl>` : `<p class="empty">${esc(l.summary || 'Added by hand.')}</p>`}
      <p class="sub" style="margin-top:12px">Came in ${esc(fmtWhen(l.created_at))}${l.source === 'website' ? ` · Ref ${esc(l.id)}` : ` · added by ${esc(l.created_by)}`}</p>
    </section>
    <section class="card"><h2>${icon('clock')}Notes and history</h2>${noteForm(`/lead/${encodeURIComponent(l.id)}/note`)}<div style="margin-top:14px">${feed(acts)}</div></section>
    <details class="more card"><summary>${icon('edit', 18)} Fix their name, phone or email</summary>
      <form method="post" action="/lead/${encodeURIComponent(l.id)}/contact" style="margin-top:12px">
        <div class="f"><label class="l" for="n">Name</label><input id="n" type="text" name="name" value="${esc(l.name)}" required></div>
        <div class="f"><label class="l" for="p">Phone</label><input id="p" type="tel" name="phone" value="${esc(l.phone ?? '')}"></div>
        <div class="f"><label class="l" for="e">Email</label><input id="e" type="email" name="email" value="${esc(l.email ?? '')}"></div>
        <button class="btn" type="submit">${icon('check')}Save</button></form></details>
  </div></div>`;
}

export function newLeadBody(): string {
  return `<a class="backlink" href="/leads">${icon('back', 18)}Leads</a><h1>Add a lead</h1>
  <p class="sub">Someone called, texted or stopped you in town. Put them here so nobody forgets.</p>
  <form class="card" method="post" action="/leads">
    <div class="f"><p class="l">What do they want?</p><div class="choice">
      <label><input type="radio" name="kind" value="hunt" checked>${icon('target', 18)} A hunt</label>
      <label><input type="radio" name="kind" value="trap">${icon('pig', 18)} Hog trapping</label>
      <label><input type="radio" name="kind" value="question">${icon('text', 18)} Just a question</label></div></div>
    <div class="f"><label class="l" for="n">Name</label><input id="n" type="text" name="name" required autocomplete="off"></div>
    <div class="two"><div class="f"><label class="l" for="p">Phone</label><input id="p" type="tel" name="phone"></div>
    <div class="f"><label class="l" for="e">Email</label><input id="e" type="email" name="email"></div></div>
    <div class="f"><label class="l" for="w">What did they say?</label><textarea id="w" name="summary" placeholder="Thermal hog hunt for 4 in December, flexible on dates"></textarea></div>
    <button class="btn red" type="submit" style="width:100%">${icon('check')}Save lead</button>
  </form>`;
}

/* ------------------------------------------------------------ Hunts */
export function huntForm(h: Partial<Hunt>, guides: string[], action: string, heading: string, backHref: string): string {
  const v = (x: unknown) => esc(x ?? '');
  const total = h.total ?? '';
  return `<a class="backlink" href="${backHref}">${icon('back', 18)}Back</a><h1>${esc(heading)}</h1>
  <form class="card" method="post" action="${action}">
    <div class="f"><label class="l" for="c">Client name</label><input id="c" type="text" name="client" value="${v(h.client)}" required></div>
    <div class="two"><div class="f"><label class="l" for="p">Phone</label><input id="p" type="tel" name="phone" value="${v(h.phone)}"></div>
    <div class="f"><label class="l" for="e">Email</label><input id="e" type="email" name="email" value="${v(h.email)}"></div></div>
    <div class="f"><label class="l" for="t">Hunt</label><select id="t" name="hunt_type" required data-type>
      ${HUNT_OPTIONS.map((o) => `<option value="${o.value}" data-each="${EACH[o.value] ?? ''}"${h.hunt_type === o.value ? ' selected' : ''}>${esc(o.label)} (${esc(o.price)})</option>`).join('')}
      <option value="trapping" ${h.hunt_type === 'trapping' ? 'selected' : ''}>Hog trapping job</option>
    </select></div>
    <div class="two"><div class="f"><label class="l" for="d">Date</label><input id="d" type="date" name="date" value="${v(h.date)}" required></div>
    <div class="f"><label class="l" for="st">Start time</label><input id="st" type="time" name="start_time" value="${v(h.start_time)}"></div></div>
    <div class="two"><div class="f"><label class="l" for="tw">Town</label><input id="tw" type="text" name="town" list="towns" value="${v(h.town)}" placeholder="Salado"><datalist id="towns">${TOWNS.map((t) => `<option value="${t}">`).join('')}</datalist></div>
    <div class="f"><label class="l" for="g">Guns</label><input id="g" type="number" name="guns" min="1" max="99" inputmode="numeric" value="${v(h.guns)}" data-guns></div></div>
    <div class="f"><label class="l" for="tot">Total price ($)</label><input id="tot" type="text" inputmode="numeric" name="total" value="${v(total)}" placeholder="1000" data-total>
      <p class="hint">Deposit to lock it in: <b data-half>half the total</b>. ${esc(SITE.name)} confirms the hunt first, then the deposit is due.</p></div>
    <div class="f"><p class="l">Guide</p><div class="choice">
      ${[...guides, 'Not set'].map((g) => `<label><input type="radio" name="guide" value="${g === 'Not set' ? '' : esc(g)}"${(h.guide ?? '') === (g === 'Not set' ? '' : g) ? ' checked' : ''}>${esc(g)}</label>`).join('')}</div></div>
    <div class="f"><label class="l" for="nt">Notes</label><textarea id="nt" name="notes" placeholder="Bringing own rifles. One youth hunter.">${v(h.notes)}</textarea></div>
    <button class="btn red" type="submit" style="width:100%">${icon('check')}Save</button>
  </form>`;
}

export function huntBody(h: Hunt, calls: Callback[], acts: Activity[]): string {
  const dep = DEPOSIT_STATE[h.deposit] ?? DEPOSIT_STATE.due;
  const st = HUNT_STATUS[h.status] ?? HUNT_STATUS.scheduled;
  const open = calls.filter((c) => !c.done_at);
  const half = h.total ? Math.round(h.total / 2) : null;
  const label = h.hunt_type === 'trapping' ? 'Hog trapping job' : huntLabel(h.hunt_type);
  return `<a class="backlink" href="/calendar?m=${h.date.slice(0, 7)}">${icon('back', 18)}Calendar</a>
  <div class="head"><div><p class="eyebrow" style="color:${color(h.hunt_type)}">${esc(label)}</p><h1>${esc(h.client)}</h1></div>${chip(st.label, st.tone)}</div>
  <p class="big">${esc(fmtDay(h.date))}${h.start_time ? ` · ${esc(fmtTime(h.start_time))}` : ''}</p>
  ${contactButtons(h.phone, h.email)}
  <div class="grid2"><div>
    <section class="card"><h2>${icon('dollar')}Money</h2>
      <dl class="kv"><dt>Total</dt><dd>${h.total ? money(h.total) : 'Not set'}</dd><dt>Deposit (half)</dt><dd>${half ? money(half) : 'Set a total first'}</dd><dt>Status</dt><dd>${chip(dep.label, dep.tone)}</dd></dl>
      ${h.status !== 'canceled' ? `<form method="post" action="/hunt/${h.id}/deposit" style="margin-top:14px"><div class="btns full">
        ${h.deposit !== 'paid' ? `<button class="btn green" type="submit" name="deposit" value="paid">${icon('check')}Deposit paid</button>` : ''}
        ${h.deposit !== 'full' ? `<button class="btn green" type="submit" name="deposit" value="full">${icon('dollar')}Paid in full</button>` : ''}
        ${h.deposit !== 'due' ? `<button class="btn ghost" type="submit" name="deposit" value="due">Undo: not paid</button>` : ''}
      </div></form>` : ''}
    </section>
    <section class="card"><h2>${icon('note')}Details</h2>
      <dl class="kv"><dt>Hunt</dt><dd>${esc(label)}</dd><dt>Guns</dt><dd>${h.guns ?? ''}</dd><dt>Town</dt><dd>${esc(h.town ?? '')}</dd><dt>Guide</dt><dd>${esc(h.guide || 'Not set')}</dd>${h.notes ? `<dt>Notes</dt><dd>${esc(h.notes)}</dd>` : ''}
      ${h.lead_id ? `<dt>Lead</dt><dd><a href="/lead/${encodeURIComponent(h.lead_id)}">Open their lead</a></dd>` : ''}</dl>
      <p class="sub" style="margin-top:10px">Booked by ${esc(h.created_by)} · ${esc(fmtWhen(h.created_at))}</p>
      ${h.status !== 'canceled' ? `<a class="btn ghost small" href="/hunt/${h.id}/edit" style="margin-top:8px">${icon('edit', 18)}Change details</a>` : ''}
    </section>
    ${h.status === 'done' ? `<section class="card" style="border-color:var(--green)"><h2>${icon('check')}How it went</h2><dl class="kv">
      ${h.hogs != null ? `<dt>Hogs</dt><dd>${h.hogs}</dd>` : ''}${h.deer != null ? `<dt>Deer</dt><dd>${h.deer}</dd>` : ''}${h.other_game != null ? `<dt>Birds or other</dt><dd>${h.other_game}</dd>` : ''}${h.result_notes ? `<dt>Notes</dt><dd>${esc(h.result_notes)}</dd>` : ''}</dl></section>` : ''}
    ${h.status === 'scheduled' ? `<div class="btns full" style="margin-bottom:16px"><a class="btn green" href="/hunt/${h.id}/log">${icon('check')}Hunt is done</a>
      <form method="post" action="/hunt/${h.id}/cancel" onsubmit="return confirm('Cancel this hunt? It stays on record as canceled.')"><button class="btn ghost" type="submit" style="width:100%">${icon('x')}Cancel hunt</button></form></div>` : ''}
  </div><div>
    <section class="card"><h2>${icon('callback')}Call back</h2>
      ${open.length ? `<ul class="list">${open.map((c) => callbackRow({ ...c, name: c.note, phone: h.phone }, c.due < todayCT())).join('')}</ul><hr style="border:0;border-top:1px solid var(--line);margin:12px 0">` : ''}
      ${callbackForm(`/hunt/${h.id}/callback`)}</section>
    <section class="card"><h2>${icon('clock')}Notes and history</h2>${noteForm(`/hunt/${h.id}/note`)}<div style="margin-top:14px">${feed(acts)}</div></section>
  </div></div>`;
}

export function logBody(h: Hunt): string {
  const num = (name: string, label: string, val: number | null) =>
    `<div class="f"><label class="l" for="${name}">${label}</label><input id="${name}" type="number" min="0" inputmode="numeric" name="${name}" value="${val ?? ''}" placeholder="0"></div>`;
  return `<a class="backlink" href="/hunt/${h.id}">${icon('back', 18)}Back to the hunt</a>
  <h1>How did it go?</h1><p class="sub">${esc(h.client)} · ${esc(fmtDay(h.date))}</p>
  <form class="card" method="post" action="/hunt/${h.id}/done">
    <div class="two">${num('hogs', 'Hogs taken', h.hogs)}${num('deer', 'Deer taken', h.deer)}</div>
    ${num('other_game', 'Birds, coyotes or other', h.other_game)}
    <div class="f"><label class="l" for="rn">Anything worth remembering?</label><textarea id="rn" name="result_notes" placeholder="Great group, wants to come back in January">${esc(h.result_notes ?? '')}</textarea></div>
    <div class="f"><label class="choice" style="display:block"><label><input type="checkbox" name="review" value="1" checked> Remind us tomorrow to thank them and ask for a Google review</label></label></div>
    <button class="btn green" type="submit" style="width:100%">${icon('check')}Save. Hunt is done</button>
  </form>`;
}

export function huntsBody(title: string, hunts: Hunt[], note: string): string {
  return `<div class="head"><h1>${esc(title)}</h1><a class="btn red" href="/hunts/new">${icon('plus')}Book a hunt</a></div><p class="sub">${esc(note)}</p>
  <section class="card">${hunts.length ? `<ul class="list">${hunts.map((h) => huntRow(h)).join('')}</ul>` : `<p class="empty">Nothing here.</p>`}</section>`;
}

/* ---------------------------------------------------------- Calendar */
const short = (ym: string) => new Date(`${ym}-15T12:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short' });

export function calendarBody(month: string, hunts: Hunt[]): string {
  const [y, m] = month.split('-').map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const start = new Date(first);
  start.setUTCDate(1 - first.getUTCDay());
  const prev = new Date(Date.UTC(y, m - 2, 1)).toISOString().slice(0, 7);
  const next = new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 7);
  const t = todayCT();
  const byDay = new Map<string, Hunt[]>();
  for (const h of hunts) byDay.set(h.date, [...(byDay.get(h.date) ?? []), h]);
  const cells: string[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    const ymd = d.toISOString().slice(0, 10);
    if (i >= 35 && ymd.slice(0, 7) !== month) break;
    const list = byDay.get(ymd) ?? [];
    cells.push(`<a class="day${ymd.slice(0, 7) !== month ? ' out' : ''}${ymd === t ? ' today' : ''}" href="${list.length ? `#d${ymd}` : `/hunts/new?date=${ymd}`}" aria-label="${esc(fmtDay(ymd))}, ${list.length} hunts">
      <span class="num">${d.getUTCDate()}</span>${list.map((h) => `<span class="pill" style="background:${color(h.hunt_type)}${h.status === 'canceled' ? ';opacity:.35;text-decoration:line-through' : ''}">${esc(h.client.split(' ')[0])}</span>`).join('')}</a>`);
  }
  const monthName = first.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', year: 'numeric' });
  const days = [...byDay.keys()].sort();
  const types = [...new Set(hunts.map((h) => h.hunt_type))];
  return `<div class="head"><h1>${esc(monthName)}</h1><a class="btn red" href="/hunts/new">${icon('plus')}Book a hunt</a></div>
  <div class="monthnav"><a class="btn ghost small" href="/calendar?m=${prev}">${icon('back', 18)}${short(prev)}</a><a class="btn ghost small" href="/calendar">This month</a><a class="btn ghost small" href="/calendar?m=${next}">${short(next)}${icon('next', 18)}</a></div>
  <div class="card"><div class="cal">${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => `<div class="dow">${d}</div>`).join('')}${cells.join('')}</div>
  ${types.length ? `<div class="legend">${types.map((v) => `<span><i class="dot" style="background:${color(v)}"></i>${esc(v === 'trapping' ? 'Hog trapping' : huntLabel(v))}</span>`).join('')}</div>` : ''}
  <p class="sub" style="margin-top:10px">Tap an empty day to book a hunt on it.</p></div>
  ${days.length ? days.map((d) => `<section class="card" id="d${d}"><h2>${esc(fmtDay(d))}</h2><ul class="list">${(byDay.get(d) ?? []).map((h) => huntRow(h, false)).join('')}</ul></section>`).join('') : `<section class="card"><p class="empty">No hunts this month yet.</p></section>`}`;
}

/* ---------------------------------------------------------- Activity */
export function activityBody(acts: Activity[], who: string, people: string[]): string {
  return `<h1>Who did what</h1><p class="sub">Every change anyone makes in the Back Office, newest first. Nothing here can be edited or erased.</p>
  <nav class="filters"><a href="/activity" class="${!who ? 'on' : ''}">Everyone</a>${people.map((p) => `<a href="/activity?who=${encodeURIComponent(p)}" class="${who === p ? 'on' : ''}">${esc(p)}</a>`).join('')}</nav>
  <section class="card">${feed(acts, true)}</section>`;
}
