/* Case records. Ported from backcountrydrones.com worker/cases.ts (2026-10-31)
 * so a Red Creek hog trap request is the same shape as a BCD hog assessment:
 * one record per request at case:<ref>, plus an empty board index key
 * board:<status>:<createdAt>:<ref> so a board can list by column without
 * scanning every case. Same shape means the BCD ops console can take these
 * later without a translation layer.
 *
 * Search-only fields from the BCD file (review token, stage, AI assessment,
 * signature) are left out on purpose. Red Creek hog jobs move by phone after
 * intake, exactly like BCD hog jobs do.
 *
 * KV is eventually consistent: callers use the record openCase returns, never
 * a fresh read.
 */

export type CaseKind = 'hog';
export type CaseStatus = 'new' | 'open' | 'closed';

export interface CaseEvent {
  at: string;
  kind: string;
  actor: 'client' | 'staff' | 'system';
  visibility: 'internal' | 'client';
  title: string;
  body?: string;
}

export interface CaseRecord {
  schema: 1;
  id: string;
  kind: CaseKind;
  status: CaseStatus;
  /** Per case read token for /api/case. Internal only. Never goes to a customer. */
  token: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  outcome?: string;
  /** One line for the board. */
  title: string;
  /** County, for sorting the board by where the work is. */
  locality?: string;
  party: { name?: string; email?: string; phone?: string };
  /** The submitted intake, verbatim. */
  intake: Record<string, unknown>;
  events: CaseEvent[];
}

const KEY = (id: string) => `case:${id}`;
const BOARD = (status: CaseStatus, createdAt: string, id: string) => `board:${status}:${createdAt}:${id}`;

function rand(n: number): string {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function getCase(store: KVNamespace, id: string): Promise<CaseRecord | null> {
  const raw = await store.get(KEY(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CaseRecord;
  } catch {
    return null;
  }
}

export async function openCase(
  store: KVNamespace,
  input: { id: string; kind: CaseKind; title: string; locality?: string; party: CaseRecord['party']; intake: Record<string, unknown>; event: Omit<CaseEvent, 'at'> }
): Promise<CaseRecord> {
  const now = new Date().toISOString();
  const rec: CaseRecord = {
    schema: 1,
    id: input.id,
    kind: input.kind,
    status: 'new',
    token: rand(16),
    createdAt: now,
    updatedAt: now,
    title: input.title,
    locality: input.locality,
    party: input.party,
    intake: input.intake,
    events: [{ at: now, ...input.event }],
  };
  await store.put(KEY(rec.id), JSON.stringify(rec), { metadata: { kind: rec.kind, status: rec.status, createdAt: now } });
  await store.put(BOARD('new', now, rec.id), '');
  return rec;
}

/** Case ids in a board column, newest first. */
export async function listBoard(store: KVNamespace, status: CaseStatus): Promise<string[]> {
  const ids: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await store.list({ prefix: `board:${status}:`, cursor });
    for (const k of page.keys) ids.push(k.name.slice(k.name.lastIndexOf(':') + 1)); // ISO times contain colons; the id never does
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor && ids.length < 500);
  return ids.reverse();
}

/* ---------------------------------------------------------------- refs
 * Same format as BCD: PREFIX-DDMMMYY-last4 of the phone, dated in Central
 * time, e.g. RCH-31OCT26-5045. Prefix RCH (Red Creek Hog) so a Red Creek
 * case never reads as a BCD HOG- case in the shared ops inbox.
 *
 * COLLISIONS. The same phone twice in one day collides, which would
 * overwrite a case. So the store is checked and -2, -3 ... is appended.
 */
const CENTRAL_DATE = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', day: '2-digit', month: 'short', year: '2-digit' });

function stampCentral(at = new Date()): string {
  const parts = CENTRAL_DATE.formatToParts(at);
  const get = (t: string) => parts.find((x) => x.type === t)?.value ?? '';
  return `${get('day')}${get('month').toUpperCase()}${get('year')}`;
}

function last4(phone: unknown): string {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.length >= 4) return digits.slice(-4);
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
}

export async function confirmationId(prefix: string, phone: unknown, store?: KVNamespace): Promise<string> {
  const base = `${prefix}-${stampCentral()}-${last4(phone)}`;
  if (!store) return base;
  try {
    for (let n = 1; n <= 9; n++) {
      const id = n === 1 ? base : `${base}-${n}`;
      if (!(await store.get(KEY(id)))) return id;
    }
    return `${base}-${Math.floor(Math.random() * 90 + 10)}`;
  } catch (err) {
    console.error('confirmation collision check failed, using base', err);
    return base;
  }
}
