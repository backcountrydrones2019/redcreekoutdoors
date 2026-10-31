/* Read-only case board and case view, ported from backcountrydrones.com.
 *
 *   /api/board?k=<BOARD_KEY>      every case by column (new, open, closed)
 *   /api/case?id=<ref>&k=<token>  one case: events plus the full intake
 *
 * Unlisted and gated: the board 404s until the BOARD_KEY secret is set on the
 * Worker, and a case needs its own per-case token (only on the board). Read
 * only: nothing here changes a case. Moving cases between columns belongs to
 * the ops console, behind real auth, not a query string.
 */
import { getCase, listBoard, type CaseRecord, type CaseStatus } from './cases';
import { esc } from './mail';

const STYLE =
  '<style>body{font:15px/1.5 -apple-system,sans-serif;max-width:46rem;margin:2rem auto;padding:0 1rem;color:#232222}' +
  'h1{font-size:1.25rem;margin:0 0 .25rem}h2{font-size:.8rem;text-transform:uppercase;letter-spacing:.08em;color:#5d5a58;margin:1.5rem 0 .5rem}' +
  '.c{color:#c1282c}ul{list-style:none;padding:0}li{border-left:3px solid #c1282c;padding:.45rem 0 .45rem .75rem;margin:.6rem 0}' +
  'a{color:#232222}.m,time{display:block;color:#5d5a58;font-size:.75rem}.e{color:#5d5a58}.s{color:#5d5a58;font-size:.8rem;text-transform:uppercase;letter-spacing:.08em}' +
  'pre{background:#f4f1ec;padding:1rem;overflow:auto;font-size:.8rem}</style>';
const HEAD = (title: string) =>
  `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>${STYLE}`;
const page = (html: string) =>
  new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex, nofollow', 'cache-control': 'no-store' } });
const deny = () => new Response('Not found', { status: 404 });

export async function handleBoard(req: Request, store: KVNamespace | undefined, boardKey: string | undefined): Promise<Response> {
  const key = new URL(req.url).searchParams.get('k') || '';
  if (!store || !boardKey || key !== boardKey) return deny();
  const parts: string[] = [];
  for (const status of ['new', 'open', 'closed'] as CaseStatus[]) {
    const rows: string[] = [];
    for (const id of (await listBoard(store, status)).slice(0, 50)) {
      const rec = await getCase(store, id);
      if (!rec) continue;
      rows.push(
        `<li><a href="/api/case?id=${encodeURIComponent(rec.id)}&k=${encodeURIComponent(rec.token)}">${esc(rec.title)}</a>` +
          `<span class="m">${esc(rec.id)} / ${esc(rec.kind)}${rec.locality ? ` / ${esc(rec.locality)} County` : ''} / ${esc(rec.updatedAt.slice(0, 16).replace('T', ' '))} UTC</span></li>`
      );
    }
    parts.push(`<h2>${status} <span class="c">${rows.length}</span></h2>` + (rows.length ? `<ul>${rows.join('')}</ul>` : '<p class="e">Nothing here.</p>'));
  }
  return page(HEAD('Board') + '<h1>Red Creek board</h1><p class="m" style="font-size:.85rem">Hog trap requests. Read only.</p>' + parts.join(''));
}

export async function handleCaseView(req: Request, store: KVNamespace | undefined): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') || '';
  const key = url.searchParams.get('k') || '';
  if (!store || !id || !key) return deny();
  const rec = await getCase(store, id);
  if (!rec || key.length !== rec.token.length || key !== rec.token) return deny();
  const line = (e: CaseRecord['events'][number]) =>
    `<li><time>${esc(e.at)}</time> <b>${esc(e.title)}</b><span class="m">${esc(e.kind)} / ${esc(e.actor)} / ${esc(e.visibility)}</span>` +
    (e.body ? `<p>${esc(e.body).replace(/\n/g, '<br>')}</p>` : '') + '</li>';
  return page(
    HEAD(rec.id) +
      `<h1>${esc(rec.title)}</h1><p class="s">${esc(rec.id)} / ${esc(rec.kind)} / ${esc(rec.status)}${rec.locality ? ` / ${esc(rec.locality)} County` : ''}</p>` +
      `<ul>${rec.events.map(line).join('')}</ul><pre>${esc(JSON.stringify(rec.intake, null, 2))}</pre>`
  );
}
