/* Web & Social: how redcreekoutdoors.com and the Red Creek social accounts are
 * doing, from the Red Creek Command Board run (Mon and Fri 08:45 CT). The run
 * writes its board documents into cmd_docs in the same JSON shapes as the
 * board artifact; this page only reads them, except Approve / Not now on a
 * proposed task, which goes into cmd_decisions for the next run to apply.
 * Everything a run wrote is shown as written; nothing here invents a number. */
import { esc, icon, chip, fmtWhen, fmtDay } from './ui';

type Lane = { lane: string; name: string; order?: number; score: number | null; rank: number | null; leader: string | null; leader_score: number | null;
  read_status?: string; read_label?: string; note?: string; queries?: { q: string; lo: number[]; read?: string; status?: string }[]; target_pages?: string };
type HistoryRow = { lane: string; points: { date: string; me: number | null; lead: number | null; leader: string | null }[] };
type SeriesPoint = { date: string; indexed?: number | null; sitemap?: number | null; clicks?: number | null; impressions?: number | null; position?: number | null };
type Post = { date: string; network: string; text: string; reach: number | null; eng: number | null; ask: boolean };
type Social = { note?: string; slots?: string; ours?: Post[]; competitors?: { name: string; posts: string; types: string; best: string }[] };
type EventRow = { date: string; event: string; city?: string; miles?: number | null; note?: string };
type Idea = { format: string; hook: string; film?: string; trend?: string };
export type Task = { id: string; owner?: string; send_to?: string; action: string; expected?: string; status: string; added?: string };
export type Decision = { id: string; decision: string; reason: string | null; who: string; at: string };
export type Docs = {
  meta?: { trend?: string; takeaway?: string; updated_label?: string; updated_at?: string };
  lanes?: { rows: Lane[] }; history?: { rows: HistoryRow[] }; series?: { points: SeriesPoint[] }; social?: Social;
  events?: { rows: EventRow[] }; content?: { rows: Idea[] }; tasks?: { rows: Task[] };
};

export function parseDocs(rows: { name: string; json: string }[]): Docs {
  const out: Record<string, unknown> = {};
  for (const r of rows) { try { out[r.name] = JSON.parse(r.json); } catch { /* a bad document is skipped, not fatal */ } }
  return out as Docs;
}

const TREND: Record<string, { tone: string; label: string; arrow: string }> = {
  'Trending up': { tone: 'green', label: 'Trending up', arrow: '↑' },
  Flat: { tone: 'amber', label: 'Holding steady', arrow: '→' },
  'Trending down': { tone: 'red', label: 'Trending down', arrow: '↓' },
};
const trendOf = (t?: string) => TREND[t ?? ''] ?? { tone: 'gray', label: 'No read yet', arrow: '' };

/** Small line chart: our points (red) against the leader (gray). */
function spark(points: { me: number | null; lead: number | null }[], w = 280, h = 60): string {
  const pts = points.filter((p) => p.me != null || p.lead != null).slice(-12);
  if (pts.length < 2) return '';
  const max = Math.max(10, ...pts.map((p) => Math.max(p.me ?? 0, p.lead ?? 0)));
  const x = (i: number) => (i / (pts.length - 1)) * (w - 8) + 4;
  const y = (v: number) => h - 6 - (v / max) * (h - 12);
  const line = (k: 'me' | 'lead') => pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p[k] ?? 0).toFixed(1)}`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" role="img" aria-label="Points over time, us against the leader">
    <path d="${line('lead')}" fill="none" stroke="#b9b3ab" stroke-width="2.5" stroke-dasharray="5 4"/>
    <path d="${line('me')}" fill="none" stroke="#c1282c" stroke-width="3"/></svg>`;
}

function barChart(points: SeriesPoint[], key: 'clicks' | 'impressions', w = 300, h = 70): string {
  const pts = points.filter((p) => typeof p[key] === 'number').slice(-10);
  if (pts.length < 2) return '';
  const max = Math.max(...pts.map((p) => p[key] as number));
  const bw = w / pts.length;
  return `<svg viewBox="0 0 ${w} ${h + 16}" width="100%" height="${h + 16}" role="img" aria-label="Google ${key} over time">${pts.map((p, i) => {
    const v = p[key] as number; const bh = Math.max(2, (v / max) * h);
    return `<rect x="${(i * bw + 3).toFixed(1)}" y="${(h - bh).toFixed(1)}" width="${(bw - 6).toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${i === pts.length - 1 ? '#2f7a3a' : '#a8c9ae'}"/>
      <text x="${(i * bw + bw / 2).toFixed(1)}" y="${h + 13}" font-size="10" text-anchor="middle" fill="#5d5a58">${esc(p.date.slice(5).replace('-', '/'))}</text>`;
  }).join('')}</svg>`;
}

const OPEN = ['Proposed', 'Approved', 'Sent', 'On hold'];
const STATUS_TONE: Record<string, string> = { Proposed: 'amber', Approved: 'blue', Sent: 'blue', 'On hold': 'gray', Done: 'green', Merged: 'gray', Expired: 'gray', Declined: 'gray' };
const STATUS_WORD: Record<string, string> = { Proposed: 'Needs a yes or no', Approved: 'Approved', Sent: 'In progress', 'On hold': 'On hold', Done: 'Done', Merged: 'Merged', Expired: 'Expired', Declined: 'Turned down' };

/** The card on Today. */
export function onlineCard(d: Docs, updatedAt: string | null, decided: Set<string> = new Set()): string {
  if (!d.meta) return '';
  const t = trendOf(d.meta.trend);
  const first = (d.meta.takeaway ?? '').split(/(?<=\.)\s/)[0] ?? '';
  const needs = (d.tasks?.rows ?? []).filter((x) => x.status === 'Proposed' && !decided.has(x.id)).length;
  return `<a class="card" href="/online" style="display:block;text-decoration:none;border-left:6px solid var(--${t.tone === 'gray' ? 'gray' : t.tone})">
    <h2>${icon('chart')}Web &amp; Social ${chip(`${t.arrow} ${t.label}`, t.tone)}</h2>
    <p>${esc(first)}</p>
    <p class="sub">${needs ? `<b style="color:var(--amber)">${needs} idea${needs === 1 ? '' : 's'} waiting on a yes or no</b> · ` : ''}Updated ${esc(updatedAt ? fmtWhen(updatedAt) : d.meta.updated_label ?? '')} ${icon('next', 14)}</p></a>`;
}

export function onlineBody(d: Docs, updatedAt: string | null, decided: Map<string, Decision>, showDone: boolean): string {
  if (!d.meta) {
    return `<h1>Web &amp; Social</h1><section class="card"><p class="empty">No report yet. The Red Creek report runs Monday and Friday mornings at 8:45 and fills this page in.</p></section>`;
  }
  const t = trendOf(d.meta.trend);
  const lanes = [...(d.lanes?.rows ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const hist = new Map((d.history?.rows ?? []).map((r) => [r.lane, r.points]));
  const series = d.series?.points ?? [];
  const last = [...series].reverse().find((p) => p.clicks != null) ?? null;
  const prev = last ? [...series].reverse().find((p) => p.clicks != null && p.date < last.date && daysBetween(p.date, last.date) >= 7) ?? null : null;
  const lastIdx = [...series].reverse().find((p) => p.indexed != null) ?? null;
  const tasks = d.tasks?.rows ?? [];
  const open = tasks.filter((x) => OPEN.includes(x.status));
  const done = tasks.filter((x) => !OPEN.includes(x.status));
  const today = new Date().toISOString().slice(0, 10);
  const events = (d.events?.rows ?? []).filter((e) => e.date >= today).slice(0, 8);
  const social = d.social ?? {};

  const delta = (a?: number | null, b?: number | null, better: 'up' | 'down' = 'up', onTile = false) => {
    if (a == null || b == null || a === b) return '';
    const up = a > b; const good = better === 'up' ? up : !up;
    const color = onTile ? '#fff' : `var(--${good ? 'green' : 'red'})`;
    return `${onTile ? '<br>' : ' '}<span style="color:${color};font-weight:700">${up ? '↑' : '↓'} from ${esc(b.toLocaleString('en-US'))}</span>`;
  };

  return `<div class="head"><div><p class="eyebrow">Website and social media</p><h1>Web &amp; Social</h1></div>${chip(`${t.arrow} ${t.label}`, t.tone)}</div>
  <p class="sub">From the Red Creek report, ${esc(d.meta.updated_label ?? '')}${updatedAt ? ` · saved ${esc(fmtWhen(updatedAt))}` : ''}. It runs Monday and Friday mornings.</p>
  <section class="card" style="border-left:6px solid var(--${t.tone === 'gray' ? 'gray' : t.tone})"><h2>${icon('note')}Bottom line</h2><p style="font-size:18px">${esc(d.meta.takeaway ?? '')}</p></section>

  <div class="grid2"><div>
  <section class="card"><h2>${icon('search')}Where we show up on Google</h2>
    <p class="sub">Points come from where we land on three searches per line of business. 10 points for first place, down to 1 for tenth. Red line is us, dashed line is whoever is on top.</p>
    <ul class="list">${lanes.map((l) => {
      const ranked = l.rank != null;
      return `<li class="row" style="display:block">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><span class="t">${esc(l.name)}</span>
          ${ranked ? chip(`#${l.rank} on Google`, l.rank! <= 3 ? 'green' : 'blue') : chip('Not on page one', 'gray')}</div>
        <div class="s">Us: <b>${l.score ?? 0}</b> points · Top: ${esc(l.leader ?? '')} with ${l.leader_score ?? 0}${l.read_status && l.read_status !== 'ok' ? ` · <i>${esc(l.read_label ?? 'partial read')}</i>` : ''}</div>
        ${spark(hist.get(l.lane) ?? [])}
        ${(l.queries ?? []).length ? `<details class="more"><summary>The searches</summary><ul class="list">${(l.queries ?? []).map((q) =>
          `<li style="padding:6px 0">“${esc(q.q)}”: ${q.status === 'blocked' ? 'not read' : q.lo?.length ? `<b>#${q.lo.join(' and #')}</b>` : 'not on page one'}</li>`).join('')}</ul></details>` : ''}
      </li>`;
    }).join('')}</ul>
  </section>
  <section class="card"><h2>${icon('home')}The website</h2>
    ${last ? `<div class="tiles" style="margin:6px 0 10px">
      <div class="tile green"><div class="n">${last.clicks}</div><div class="l">Google clicks, last 28 days${delta(last.clicks, prev?.clicks, 'up', true)}</div></div>
      <div class="tile blue"><div class="n">${(last.impressions ?? 0).toLocaleString('en-US')}</div><div class="l">Times we showed up on Google${delta(last.impressions, prev?.impressions, 'up', true)}</div></div>
    </div>
    ${barChart(series, 'clicks')}
    <dl class="kv" style="margin-top:8px"><dt>Average spot on Google</dt><dd>${last.position ?? ''}${delta(last.position, prev?.position, 'down')} <span class="sub">(lower is better)</span></dd>
      ${lastIdx ? `<dt>Pages Google has</dt><dd>${lastIdx.indexed}${lastIdx.sitemap ? ` of ${lastIdx.sitemap}` : ''}</dd>` : ''}
      <dt>As of</dt><dd>${esc(fmtDay(last.date))}${prev ? ` <span class="sub">(compared with ${esc(fmtDay(prev.date))})</span>` : ''}</dd></dl>` : `<p class="empty">No website numbers yet.</p>`}
  </section>
  </div><div>
  <section class="card"><h2>${icon('text')}Facebook and Instagram</h2>
    ${social.note ? `<p>${esc(social.note)}</p>` : ''}
    ${(social.ours ?? []).length ? `<ul class="list">${(social.ours ?? []).map((p) => `<li class="row" style="display:block">
      <div style="display:flex;justify-content:space-between;gap:10px"><span class="t" style="font-size:16px">${esc(p.text || '(no caption)')}</span>${p.ask ? chip('Has a call to action', 'green') : chip('No phone or link', 'red')}</div>
      <div class="s">${esc(p.date)} · ${esc(p.network)} · <b>${(p.reach ?? 0).toLocaleString('en-US')}</b> reached · ${(p.eng ?? 0).toLocaleString('en-US')} likes, comments and shares</div></li>`).join('')}</ul>` : '<p class="empty">No posts in this report.</p>'}
    ${social.slots ? `<p class="sub" style="margin-top:10px"><b>Best times to post:</b> ${esc(social.slots)}</p>` : ''}
    ${(social.competitors ?? []).length ? `<details class="more"><summary>What competitors did</summary><ul class="list">${(social.competitors ?? []).map((c) =>
      `<li style="padding:8px 0;border-top:1px solid var(--line)"><b>${esc(c.name)}</b><br><span class="s">${esc(c.posts)}. ${esc(c.types)}</span><br>${esc(c.best)}</li>`).join('')}</ul></details>` : ''}
  </section>
  ${(d.content?.rows ?? []).length ? `<section class="card"><h2>${icon('target')}Post ideas</h2><ul class="list">${(d.content?.rows ?? []).map((c) =>
    `<li style="padding:10px 0;border-top:1px solid var(--line)"><b>“${esc(c.hook)}”</b><br><span class="s">${esc(c.format)}</span>${c.film ? `<br><span class="s">Film: ${esc(c.film)}</span>` : ''}</li>`).join('')}</ul></section>` : ''}
  ${events.length ? `<section class="card"><h2>${icon('calendar')}Events coming up</h2><ul class="list">${events.map((e) =>
    `<li style="padding:10px 0;border-top:1px solid var(--line)"><b>${esc(fmtDay(e.date))}</b> · ${esc(e.event)}<br><span class="s">${esc(e.city ?? '')}${e.miles != null ? `, ${e.miles} miles` : ''}${e.note ? ` · ${esc(e.note)}` : ''}</span></li>`).join('')}</ul></section>` : ''}
  </div></div>

  <section class="card" id="todo"><h2>${icon('check')}To-do list from the report</h2>
    <p class="sub">The report suggests these. Tap <b>Yes, do it</b> or <b>Not now</b> on the new ones. Your answer goes into the next report, and it says who answered.</p>
    ${open.length ? `<ul class="list">${open.map((x) => taskRow(x, decided.get(x.id))).join('')}</ul>` : '<p class="empty">Nothing open.</p>'}
    ${done.length ? (showDone
      ? `<h2 style="margin-top:18px">Finished or closed</h2><ul class="list">${done.map((x) => taskRow(x)).join('')}</ul>`
      : `<a class="btn ghost small" href="/online?done=1#todo">Show ${done.length} finished or closed</a>`) : ''}
  </section>`;
}

function taskRow(x: Task, dec?: Decision): string {
  const status = dec ? (dec.decision === 'approve' ? 'Approved' : 'Declined') : x.status;
  return `<li class="row" style="display:block">
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><span class="t" style="font-size:16px">${esc(x.id)}: ${esc(x.action)}</span>${chip(STATUS_WORD[status] ?? status, STATUS_TONE[status] ?? 'gray')}</div>
    <div class="s">${x.send_to && x.send_to !== 'Closed' ? `For: ${esc(x.send_to)}` : esc(x.owner ?? '')}${x.added ? ` · added ${esc(fmtDay(x.added))}` : ''}</div>
    ${x.expected ? `<div class="s">Should get us: ${esc(x.expected)}</div>` : ''}
    ${dec ? `<div class="s" style="margin-top:4px"><b>${esc(dec.decision === 'approve' ? 'Approved' : 'Turned down')} by ${esc(dec.who)}</b> · ${esc(fmtWhen(dec.at))}${dec.reason ? ` · “${esc(dec.reason)}”` : ''}. The next report picks it up.</div>`
      : x.status === 'Proposed' ? `<form method="post" action="/online/decide" class="btns" style="margin-top:10px">
        <input type="hidden" name="id" value="${esc(x.id)}">
        <button class="btn green small" type="submit" name="decision" value="approve">${icon('check', 18)}Yes, do it</button>
        <details class="more" style="flex:1 1 200px"><summary class="btn ghost small" style="display:inline-flex">${icon('x', 18)}Not now</summary>
          <div style="margin-top:8px"><input type="text" name="reason" placeholder="Why not? (optional)" aria-label="Why not"><button class="btn ghost small" type="submit" name="decision" value="disapprove" style="margin-top:8px">Send</button></div></details>
      </form>` : ''}
  </li>`;
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(`${b}T12:00:00Z`).getTime() - new Date(`${a}T12:00:00Z`).getTime()) / 86400000);
}

