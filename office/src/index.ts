/* RCO Back Office: leads, hunt calendar, call backs, and who did what.
 * office.redcreekoutdoors.com, behind Cloudflare Access (email code). This
 * Worker checks the Access sign-in itself and lets in only the people in USERS.
 * Records live in D1 (rco-office). Website leads are copied in from the public
 * site's KV by sync.ts. */
import type { Env, User } from './env';
import { authenticate, devLogin, sameOrigin, usersOf } from './auth';
import { syncFromSite } from './sync';
import { page, message, todayCT, addDays } from './ui';
import {
  todayBody, leadsBody, leadBody, newLeadBody, huntForm, huntBody, logBody, huntsBody, calendarBody, activityBody,
  LEAD_FILTERS, type Lead, type Hunt, type Callback, type Activity,
} from './pages';
import { HUNT_OPTIONS } from '../../src/data/hunt-booking';
import { parseDocs, onlineBody, onlineCard, type Decision } from './online';

const HUNT_TYPES = new Set<string>([...HUNT_OPTIONS.map((h) => h.value), 'trapping']);
const REF = /^[A-Z0-9-]{3,40}$/;
const YMD = /^\d{4}-\d{2}-\d{2}$/;

const see = (to: string, flash?: string) => {
  if (!flash) return new Response(null, { status: 303, headers: { location: to } });
  const [base, hash] = to.split('#');
  const location = `${base}${base.includes('?') ? '&' : '?'}ok=${encodeURIComponent(flash)}${hash ? `#${hash}` : ''}`;
  return new Response(null, { status: 303, headers: { location } });
};

const str = (fd: FormData, k: string, max = 500) => String(fd.get(k) ?? '').trim().slice(0, max);
const int = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? '').replace(/[^0-9]/g, '');
  return v ? Math.min(Number(v), 10_000_000) : null;
};

async function log(env: Env, u: User, text: string, ids: { lead?: string | null; hunt?: number | null }, kind: 'event' | 'note' = 'event') {
  await env.DB.prepare(`INSERT INTO activity (at, who, email, lead_id, hunt_id, kind, text) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`)
    .bind(new Date().toISOString(), u.name, u.email, ids.lead ?? null, ids.hunt ?? null, kind, text).run();
}

const all = async <T>(stmt: D1PreparedStatement) => ((await stmt.all<T>()).results ?? []) as T[];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const dev = devLogin(request, env);
    if (dev) return dev;

    const auth = await authenticate(request, env);
    if ('status' in auth) return message('Can’t open the Back Office', auth.message, auth.status);
    const user = auth.user;

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const flash = url.searchParams.get('ok') ?? undefined;

    try {
      if (request.method === 'POST') {
        if (!sameOrigin(request)) return message('Blocked', 'That request didn’t come from the Back Office.', 403);
        return await post(path, url, await request.formData(), env, user);
      }
      if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
      return await get(path, url, env, user, flash);
    } catch (err) {
      console.error('office error', path, err);
      return message('Something went wrong', 'That didn’t save. Go back and try once more. If it keeps happening, tell Justin.', 500);
    }
  },
};

/* ================================================================ reads */
async function get(path: string, url: URL, env: Env, user: User, flash?: string): Promise<Response> {
  const t = todayCT();
  const guides = Object.values(usersOf(env));

  if (path === '/') {
    await syncFromSite(env).catch((e) => console.error('sync failed', e));
    const [newLeads, dueCalls, weekHunts, dep, toLog, docs, decs] = await Promise.all([
      all<Lead>(env.DB.prepare(`SELECT * FROM leads WHERE status = 'new' ORDER BY created_at DESC`)),
      all<Callback & { name: string; phone: string | null }>(env.DB.prepare(
        `SELECT c.*, COALESCE(h.client, l.name) AS name, COALESCE(h.phone, l.phone) AS phone FROM callbacks c
         LEFT JOIN leads l ON l.id = c.lead_id LEFT JOIN hunts h ON h.id = c.hunt_id
         WHERE c.done_at IS NULL AND c.due <= ?1 ORDER BY c.due, c.id`).bind(t)),
      all<Hunt>(env.DB.prepare(`SELECT * FROM hunts WHERE status = 'scheduled' AND date BETWEEN ?1 AND ?2 ORDER BY date, start_time`).bind(t, addDays(t, 6))),
      env.DB.prepare(`SELECT COUNT(*) AS n FROM hunts WHERE status = 'scheduled' AND deposit = 'due'`).first<number>('n'),
      all<Hunt>(env.DB.prepare(`SELECT * FROM hunts WHERE status = 'scheduled' AND date < ?1 ORDER BY date`).bind(t)),
      all<{ name: string; json: string; updated_at: string }>(env.DB.prepare(`SELECT name, json, updated_at FROM cmd_docs WHERE name IN ('meta', 'tasks')`)),
      all<{ id: string }>(env.DB.prepare(`SELECT id FROM cmd_decisions`)),
    ]);
    const online = onlineCard(parseDocs(docs), docs.find((r) => r.name === 'meta')?.updated_at ?? null, new Set(decs.map((x) => x.id)));
    return page({ title: 'Today', user, active: '/', flash, body: todayBody({ name: user.name, newLeads, dueCalls, weekHunts, depositsDue: dep ?? 0, toLog }) + online });
  }

  if (path === '/leads') {
    await syncFromSite(env).catch((e) => console.error('sync failed', e));
    const q = (url.searchParams.get('q') ?? '').trim().slice(0, 80);
    const show = LEAD_FILTERS.some((f) => f.key === url.searchParams.get('show')) ? url.searchParams.get('show')! : 'new';
    const countRows = await all<{ status: string; n: number }>(env.DB.prepare(`SELECT status, COUNT(*) AS n FROM leads GROUP BY status`));
    const counts: Record<string, number> = { all: 0 };
    for (const r of countRows) { counts[r.status] = r.n; counts.all += r.n; }
    let leads: Lead[];
    if (q) {
      const like = `%${q.replace(/[%_]/g, '')}%`;
      const d = q.replace(/\D/g, '');
      leads = await all<Lead>(env.DB.prepare(
        `SELECT * FROM leads WHERE name LIKE ?1 OR email LIKE ?1 OR summary LIKE ?1 ${d.length >= 4 ? `OR REPLACE(REPLACE(REPLACE(REPLACE(phone,'-',''),' ',''),'(',''),')','') LIKE ?2` : ''} ORDER BY created_at DESC LIMIT 100`
      ).bind(like, `%${d}%`));
    } else {
      leads = await all<Lead>(show === 'all'
        ? env.DB.prepare(`SELECT * FROM leads ORDER BY created_at DESC LIMIT 300`)
        : env.DB.prepare(`SELECT * FROM leads WHERE status = ?1 ORDER BY created_at DESC LIMIT 300`).bind(show));
    }
    return page({ title: 'Leads', user, active: '/leads', flash, body: leadsBody(show, leads, counts, q) });
  }

  if (path === '/leads/new') return page({ title: 'Add a lead', user, active: '/leads', body: newLeadBody() });

  const leadMatch = /^\/lead\/([^/]+)$/.exec(path);
  if (leadMatch) {
    const id = decodeURIComponent(leadMatch[1]);
    if (!REF.test(id)) return message('Not found', 'That lead doesn’t exist.', 404);
    const l = await env.DB.prepare(`SELECT * FROM leads WHERE id = ?1`).bind(id).first<Lead>();
    if (!l) return message('Not found', 'That lead doesn’t exist.', 404);
    const [hunts, calls, acts] = await Promise.all([
      all<Hunt>(env.DB.prepare(`SELECT * FROM hunts WHERE lead_id = ?1 ORDER BY date DESC`).bind(id)),
      all<Callback>(env.DB.prepare(`SELECT * FROM callbacks WHERE lead_id = ?1 ORDER BY due`).bind(id)),
      all<Activity>(env.DB.prepare(`SELECT * FROM activity WHERE lead_id = ?1 OR hunt_id IN (SELECT id FROM hunts WHERE lead_id = ?1) ORDER BY at DESC, id DESC LIMIT 200`).bind(id)),
    ]);
    return page({ title: l.name, user, active: '/leads', flash, body: leadBody(l, hunts, calls, acts) });
  }

  if (path === '/hunts/new') {
    const leadId = url.searchParams.get('lead') ?? '';
    const date = url.searchParams.get('date') ?? '';
    let pre: Partial<Hunt> = { date: YMD.test(date) ? date : '' };
    if (REF.test(leadId)) {
      const l = await env.DB.prepare(`SELECT * FROM leads WHERE id = ?1`).bind(leadId).first<Lead>();
      if (l) pre = { ...pre, lead_id: l.id, client: l.name, phone: l.phone, email: l.email, hunt_type: l.kind === 'trap' ? 'trapping' : guessType(l) };
    }
    const action = `/hunts${pre.lead_id ? `?lead=${encodeURIComponent(pre.lead_id)}` : ''}`;
    return page({ title: 'Book a hunt', user, active: '/calendar', body: huntForm(pre, guides, action, pre.lead_id ? `Book ${pre.client}` : 'Book a hunt', pre.lead_id ? `/lead/${encodeURIComponent(pre.lead_id)}` : '/') });
  }

  if (path === '/hunts') {
    if (url.searchParams.get('show') === 'deposit') {
      const hunts = await all<Hunt>(env.DB.prepare(`SELECT * FROM hunts WHERE status = 'scheduled' AND deposit = 'due' ORDER BY date`));
      return page({ title: 'Deposits due', user, active: '/calendar', flash, body: huntsBody('Deposits due', hunts, 'Booked hunts where the deposit hasn’t been marked paid yet.') });
    }
    return see('/calendar');
  }

  const huntMatch = /^\/hunt\/(\d+)(\/edit|\/log)?$/.exec(path);
  if (huntMatch) {
    const id = Number(huntMatch[1]);
    const h = await env.DB.prepare(`SELECT * FROM hunts WHERE id = ?1`).bind(id).first<Hunt>();
    if (!h) return message('Not found', 'That hunt doesn’t exist.', 404);
    if (huntMatch[2] === '/edit') return page({ title: 'Change hunt', user, active: '/calendar', body: huntForm(h, guides, `/hunt/${id}`, 'Change hunt details', `/hunt/${id}`) });
    if (huntMatch[2] === '/log') return page({ title: 'How did it go?', user, active: '/calendar', body: logBody(h) });
    const [calls, acts] = await Promise.all([
      all<Callback>(env.DB.prepare(`SELECT * FROM callbacks WHERE hunt_id = ?1 ORDER BY due`).bind(id)),
      all<Activity>(env.DB.prepare(`SELECT * FROM activity WHERE hunt_id = ?1 ORDER BY at DESC, id DESC LIMIT 200`).bind(id)),
    ]);
    return page({ title: h.client, user, active: '/calendar', flash, body: huntBody(h, calls, acts) });
  }

  if (path === '/calendar') {
    const m = /^\d{4}-\d{2}$/.test(url.searchParams.get('m') ?? '') ? url.searchParams.get('m')! : t.slice(0, 7);
    const hunts = await all<Hunt>(env.DB.prepare(`SELECT * FROM hunts WHERE date BETWEEN ?1 AND ?2 ORDER BY date, start_time, id`).bind(addDays(`${m}-01`, -7), addDays(`${m}-28`, 14)));
    return page({ title: 'Calendar', user, active: '/calendar', flash, body: calendarBody(m, hunts) });
  }

  if (path === '/online') {
    const [rows, decs] = await Promise.all([
      all<{ name: string; json: string; updated_at: string }>(env.DB.prepare(`SELECT name, json, updated_at FROM cmd_docs`)),
      all<Decision>(env.DB.prepare(`SELECT * FROM cmd_decisions`)),
    ]);
    const updated = rows.find((r) => r.name === 'meta')?.updated_at ?? null;
    return page({ title: 'Web & Social', user, active: '/online', flash, body: onlineBody(parseDocs(rows), updated, new Map(decs.map((x) => [x.id, x])), url.searchParams.get('done') === '1') });
  }

  if (path === '/activity') {
    const who = (url.searchParams.get('who') ?? '').slice(0, 60);
    const acts = await all<Activity>(env.DB.prepare(
      `SELECT a.*, COALESCE(h.client, l.name) AS label FROM activity a LEFT JOIN leads l ON l.id = a.lead_id LEFT JOIN hunts h ON h.id = a.hunt_id
       ${who ? 'WHERE a.who = ?1' : ''} ORDER BY a.at DESC, a.id DESC LIMIT 300`
    ).bind(...(who ? [who] : [])));
    return page({ title: 'Who did what', user, active: '/activity', body: activityBody(acts, who, [...Object.values(usersOf(env)), 'Website']) });
  }

  return message('Not found', 'That page doesn’t exist. Use the buttons at the bottom.', 404);
}

/** Best guess at the hunt type from a website lead's summary, so the booking form starts close. */
function guessType(l: Lead): string | undefined {
  const s = `${l.summary ?? ''} ${l.details ?? ''}`.toLowerCase();
  return HUNT_OPTIONS.find((h) => s.includes(h.label.toLowerCase()))?.value
    ?? (s.includes('thermal') && s.includes('hog') ? 'thermal-hog' : s.includes('buck') ? 'whitetail-buck' : s.includes('doe') ? 'whitetail-doe' : undefined);
}

/* =============================================================== writes */
async function post(path: string, url: URL, fd: FormData, env: Env, u: User): Promise<Response> {
  const now = new Date().toISOString();

  if (path === '/leads') {
    const name = str(fd, 'name', 120);
    if (!name) return see('/leads/new');
    const kind = ['hunt', 'trap', 'question'].includes(str(fd, 'kind')) ? str(fd, 'kind') : 'hunt';
    const n = ((await env.DB.prepare(`SELECT COUNT(*) AS n FROM leads WHERE source = 'added'`).first<number>('n')) ?? 0) + 1;
    const id = `OFF-${todayCT().replace(/-/g, '').slice(2)}-${String(n).padStart(3, '0')}`;
    const summary = str(fd, 'summary', 2000);
    await env.DB.prepare(`INSERT INTO leads (id, kind, name, phone, email, summary, details, status, source, created_at, updated_at, created_by) VALUES (?1, ?2, ?3, ?4, ?5, ?6, '[]', 'new', 'added', ?7, ?7, ?8)`)
      .bind(id, kind, name, str(fd, 'phone', 40), str(fd, 'email', 160), summary, now, u.name).run();
    await log(env, u, `Added ${name} as a lead`, { lead: id });
    return see(`/lead/${id}`, 'Lead saved');
  }

  const leadPost = /^\/lead\/([^/]+)\/(status|note|callback|contact)$/.exec(path);
  if (leadPost) {
    const id = decodeURIComponent(leadPost[1]);
    const l = REF.test(id) ? await env.DB.prepare(`SELECT * FROM leads WHERE id = ?1`).bind(id).first<Lead>() : null;
    if (!l) return message('Not found', 'That lead doesn’t exist.', 404);
    const back = `/lead/${encodeURIComponent(id)}`;
    switch (leadPost[2]) {
      case 'status': {
        const st = str(fd, 'status');
        const words: Record<string, string> = { new: 'moved back to New', talked: 'talked to them', booked: 'marked booked', lost: 'marked not booking' };
        if (!words[st] || st === l.status) return see(back);
        await env.DB.prepare(`UPDATE leads SET status = ?1, updated_at = ?2 WHERE id = ?3`).bind(st, now, id).run();
        await log(env, u, st === 'talked' ? `Talked to ${l.name}` : `${l.name}: ${words[st]}`, { lead: id });
        return see(back, st === 'talked' ? 'Marked: we talked. Set a call back if needed.' : 'Saved');
      }
      case 'note': {
        const note = str(fd, 'note', 4000);
        if (note) await log(env, u, note, { lead: id }, 'note');
        return see(back, 'Note saved');
      }
      case 'callback': {
        const due = dueFrom(fd);
        const note = str(fd, 'note', 300) || 'Call back';
        if (!due) return see(back);
        await env.DB.prepare(`INSERT INTO callbacks (lead_id, due, note, created_at, created_by) VALUES (?1, ?2, ?3, ?4, ?5)`).bind(id, due, note, now, u.name).run();
        await log(env, u, `Set a call back for ${due}: ${note}`, { lead: id });
        return see(back, 'Call back set');
      }
      case 'contact': {
        const name = str(fd, 'name', 120) || l.name;
        await env.DB.prepare(`UPDATE leads SET name = ?1, phone = ?2, email = ?3, updated_at = ?4 WHERE id = ?5`).bind(name, str(fd, 'phone', 40), str(fd, 'email', 160), now, id).run();
        await log(env, u, `Changed contact info (was ${l.name}, ${l.phone || 'no phone'}, ${l.email || 'no email'})`, { lead: id });
        return see(back, 'Saved');
      }
    }
  }

  if (path === '/hunts' || /^\/hunt\/\d+$/.test(path)) {
    const editing = path !== '/hunts' ? Number(path.split('/')[2]) : null;
    const v = huntFields(fd);
    if (!v) return message('Missing something', 'A hunt needs a client name, a hunt type and a date. Go back and fill those in.', 400);
    if (editing) {
      const old = await env.DB.prepare(`SELECT * FROM hunts WHERE id = ?1`).bind(editing).first<Hunt>();
      if (!old) return message('Not found', 'That hunt doesn’t exist.', 404);
      await env.DB.prepare(`UPDATE hunts SET client=?1, phone=?2, email=?3, hunt_type=?4, date=?5, start_time=?6, town=?7, guns=?8, total=?9, guide=?10, notes=?11, updated_at=?12 WHERE id=?13`)
        .bind(v.client, v.phone, v.email, v.hunt_type, v.date, v.start_time, v.town, v.guns, v.total, v.guide, v.notes, now, editing).run();
      const changed = diff(old, v);
      await log(env, u, changed.length ? `Changed ${changed.join(', ')}` : 'Saved the hunt with no changes', { hunt: editing, lead: old.lead_id });
      return see(`/hunt/${editing}`, 'Saved');
    }
    const leadId = url.searchParams.get('lead') ?? '';
    const lid = REF.test(leadId) && (await env.DB.prepare(`SELECT 1 FROM leads WHERE id = ?1`).bind(leadId).first()) ? leadId : null;
    const r = await env.DB.prepare(
      `INSERT INTO hunts (lead_id, client, phone, email, hunt_type, date, start_time, town, guns, total, guide, notes, created_at, updated_at, created_by)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?13, ?14) RETURNING id`
    ).bind(lid, v.client, v.phone, v.email, v.hunt_type, v.date, v.start_time, v.town, v.guns, v.total, v.guide, v.notes, now, u.name).first<number>('id');
    if (lid) await env.DB.prepare(`UPDATE leads SET status = 'booked', updated_at = ?1 WHERE id = ?2`).bind(now, lid).run();
    await log(env, u, `Booked ${v.client} for ${v.date}${v.guns ? `, ${v.guns} guns` : ''}${v.total ? `, $${v.total}` : ''}`, { hunt: r, lead: lid });
    return see(`/hunt/${r}`, 'Hunt booked. It’s on the calendar.');
  }

  const huntPost = /^\/hunt\/(\d+)\/(deposit|done|cancel|note|callback)$/.exec(path);
  if (huntPost) {
    const id = Number(huntPost[1]);
    const h = await env.DB.prepare(`SELECT * FROM hunts WHERE id = ?1`).bind(id).first<Hunt>();
    if (!h) return message('Not found', 'That hunt doesn’t exist.', 404);
    const back = `/hunt/${id}`;
    const ids = { hunt: id, lead: h.lead_id };
    switch (huntPost[2]) {
      case 'deposit': {
        const d = str(fd, 'deposit');
        const words: Record<string, string> = { paid: 'Marked the deposit paid', full: 'Marked paid in full', due: 'Undid the payment: deposit due again' };
        if (!words[d] || d === h.deposit) return see(back);
        await env.DB.prepare(`UPDATE hunts SET deposit = ?1, updated_at = ?2 WHERE id = ?3`).bind(d, now, id).run();
        await log(env, u, words[d], ids);
        return see(back, words[d]);
      }
      case 'done': {
        await env.DB.prepare(`UPDATE hunts SET status = 'done', hogs = ?1, deer = ?2, other_game = ?3, result_notes = ?4, updated_at = ?5 WHERE id = ?6`)
          .bind(int(fd, 'hogs'), int(fd, 'deer'), int(fd, 'other_game'), str(fd, 'result_notes', 4000), now, id).run();
        const parts = [['hogs', 'hogs'], ['deer', 'deer'], ['other_game', 'other']].map(([k, w]) => (int(fd, k) ? `${int(fd, k)} ${w}` : '')).filter(Boolean);
        await log(env, u, `Logged the hunt as done${parts.length ? `: ${parts.join(', ')}` : ''}`, ids);
        if (fd.get('review')) {
          await env.DB.prepare(`INSERT INTO callbacks (lead_id, hunt_id, due, note, created_at, created_by) VALUES (?1, ?2, ?3, ?4, ?5, ?6)`)
            .bind(h.lead_id, id, addDays(todayCT(), 1), 'Thank them and ask for a Google review', now, u.name).run();
        }
        return see(back, 'Hunt logged');
      }
      case 'cancel': {
        if (h.status !== 'scheduled') return see(back);
        await env.DB.prepare(`UPDATE hunts SET status = 'canceled', updated_at = ?1 WHERE id = ?2`).bind(now, id).run();
        await log(env, u, 'Canceled the hunt', ids);
        return see(back, 'Hunt canceled');
      }
      case 'note': {
        const note = str(fd, 'note', 4000);
        if (note) await log(env, u, note, ids, 'note');
        return see(back, 'Note saved');
      }
      case 'callback': {
        const due = dueFrom(fd);
        const note = str(fd, 'note', 300) || 'Call back';
        if (!due) return see(back);
        await env.DB.prepare(`INSERT INTO callbacks (lead_id, hunt_id, due, note, created_at, created_by) VALUES (?1, ?2, ?3, ?4, ?5, ?6)`).bind(h.lead_id, id, due, note, now, u.name).run();
        await log(env, u, `Set a call back for ${due}: ${note}`, ids);
        return see(back, 'Call back set');
      }
    }
  }

  if (path === '/online/decide') {
    const id = str(fd, 'id', 20);
    const decision = str(fd, 'decision', 20);
    if (!/^RC-\d{1,4}$/.test(id) || !['approve', 'disapprove'].includes(decision)) return see('/online#todo');
    const reason = str(fd, 'reason', 300);
    // Only a task the last report left as Proposed can be decided here.
    const tasks = await env.DB.prepare(`SELECT json FROM cmd_docs WHERE name = 'tasks'`).first<string>('json');
    let action = '';
    try { const row = (JSON.parse(tasks ?? '{}').rows ?? []).find((x: { id: string; status: string }) => x.id === id && x.status === 'Proposed'); action = row?.action ?? ''; } catch { /* treated as not found */ }
    if (!action) return see('/online#todo', 'That item already moved on in the latest report.');
    await env.DB.prepare(`INSERT INTO cmd_decisions (id, decision, reason, who, email, at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)
      ON CONFLICT(id) DO UPDATE SET decision = excluded.decision, reason = excluded.reason, who = excluded.who, email = excluded.email, at = excluded.at`)
      .bind(id, decision, reason || null, u.name, u.email, now).run();
    await log(env, u, `${decision === 'approve' ? 'Approved' : 'Turned down'} report item ${id}: ${action.slice(0, 140)}${reason ? ` (${reason})` : ''}`, {});
    return see('/online#todo', decision === 'approve' ? `${id} approved` : `${id} turned down`);
  }

  const cb = /^\/callback\/(\d+)\/done$/.exec(path);
  if (cb) {
    const c = await env.DB.prepare(`SELECT * FROM callbacks WHERE id = ?1`).bind(Number(cb[1])).first<Callback>();
    if (c && !c.done_at) {
      await env.DB.prepare(`UPDATE callbacks SET done_at = ?1, done_by = ?2 WHERE id = ?3`).bind(now, u.name, c.id).run();
      await log(env, u, `Finished call back: ${c.note}`, { lead: c.lead_id, hunt: c.hunt_id });
    }
    return see(c?.hunt_id ? `/hunt/${c.hunt_id}` : c?.lead_id ? `/lead/${encodeURIComponent(c.lead_id)}` : '/', 'Call back done');
  }

  return message('Not found', 'That action doesn’t exist.', 404);
}

function dueFrom(fd: FormData): string | null {
  const due = str(fd, 'due', 20);
  const pick = due === 'pick' ? str(fd, 'due_pick', 20) : due;
  return YMD.test(pick) ? pick : null;
}

type HuntFields = { client: string; phone: string; email: string; hunt_type: string; date: string; start_time: string; town: string; guns: number | null; total: number | null; guide: string; notes: string };

function huntFields(fd: FormData): HuntFields | null {
  const v: HuntFields = {
    client: str(fd, 'client', 120), phone: str(fd, 'phone', 40), email: str(fd, 'email', 160),
    hunt_type: str(fd, 'hunt_type', 40), date: str(fd, 'date', 10), start_time: str(fd, 'start_time', 10),
    town: str(fd, 'town', 60), guns: int(fd, 'guns'), total: int(fd, 'total'), guide: str(fd, 'guide', 40), notes: str(fd, 'notes', 4000),
  };
  if (!v.client || !HUNT_TYPES.has(v.hunt_type) || !YMD.test(v.date)) return null;
  return v;
}

const FIELD_WORDS: Record<string, string> = { client: 'name', phone: 'phone', email: 'email', hunt_type: 'hunt type', date: 'date', start_time: 'start time', town: 'town', guns: 'guns', total: 'total', guide: 'guide', notes: 'notes' };

function diff(old: Hunt, v: HuntFields): string[] {
  const out: string[] = [];
  for (const k of Object.keys(FIELD_WORDS) as (keyof HuntFields)[]) {
    const a = old[k as keyof Hunt] ?? '';
    const b = v[k] ?? '';
    if (String(a) !== String(b)) out.push(k === 'notes' ? 'notes' : `${FIELD_WORDS[k]} from ${a === '' ? 'blank' : a} to ${b === '' ? 'blank' : b}`);
  }
  return out;
}

