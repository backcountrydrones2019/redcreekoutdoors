// Who is asking. Cloudflare Access sits in front of the Back Office and signs
// every request it lets through with a JWT. This file checks that signature
// itself, so the Back Office stays shut even if Access is misconfigured or the
// Worker is reached some other way. Anything missing or wrong means no entry.

import type { Env, User } from './env';

const LEEWAY = 60; // seconds of clock skew tolerated on exp / nbf

type KeyLookup = (kid: string) => Promise<CryptoKey | null>;

function b64urlBytes(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

const b64urlJson = (s: string): any => JSON.parse(new TextDecoder().decode(b64urlBytes(s)));

/**
 * Verify an Access JWT. Returns the verified email, or throws with the reason.
 * `keyFor` returns the team's public key for a kid.
 */
export async function verifyAccessJwt(
  token: string,
  opts: { team: string; aud: string; keyFor: KeyLookup; now?: number }
): Promise<string> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('malformed token');
  const [h, p, sig] = parts;
  const header = b64urlJson(h);
  if (header.alg !== 'RS256' || typeof header.kid !== 'string') throw new Error('unexpected algorithm');

  const key = await opts.keyFor(header.kid);
  if (!key) throw new Error('unknown signing key');
  const ok = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    b64urlBytes(sig),
    new TextEncoder().encode(`${h}.${p}`)
  );
  if (!ok) throw new Error('bad signature');

  const claims = b64urlJson(p);
  const now = opts.now ?? Math.floor(Date.now() / 1000);
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audiences.includes(opts.aud)) throw new Error('wrong audience');
  if (claims.iss !== `https://${opts.team}`) throw new Error('wrong issuer');
  if (typeof claims.exp !== 'number' || claims.exp + LEEWAY < now) throw new Error('expired');
  if (typeof claims.nbf === 'number' && claims.nbf - LEEWAY > now) throw new Error('not yet valid');
  if (typeof claims.email !== 'string' || !claims.email.includes('@')) throw new Error('no email in token');
  return claims.email.toLowerCase();
}

// Public keys for the team, cached per isolate. A kid we haven't seen forces
// one refetch, which is how key rotation shows up.
const cache: { team?: string; at: number; keys: Map<string, CryptoKey> } = { at: 0, keys: new Map() };
const TTL = 10 * 60 * 1000;

async function fetchKeys(team: string): Promise<Map<string, CryptoKey>> {
  const res = await fetch(`https://${team}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error(`certs ${res.status}`);
  const body = (await res.json()) as { keys?: Array<JsonWebKey & { kid?: string }> };
  const keys = new Map<string, CryptoKey>();
  for (const jwk of body.keys ?? []) {
    if (!jwk.kid || jwk.kty !== 'RSA') continue;
    keys.set(
      jwk.kid,
      await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'])
    );
  }
  return keys;
}

/** Cloudflare's key endpoint couldn't be reached: not the person's fault. */
export class KeysUnavailable extends Error {}

function teamKeys(team: string): KeyLookup {
  return async (kid) => {
    const sameTeam = cache.team === team;
    const fresh = sameTeam && Date.now() - cache.at < TTL;
    if (fresh && cache.keys.has(kid)) return cache.keys.get(kid)!;
    try {
      cache.keys = await fetchKeys(team);
      cache.team = team;
      cache.at = Date.now();
    } catch (err) {
      // Keys we already hold for this team stay good through a blip.
      if (sameTeam && cache.keys.has(kid)) return cache.keys.get(kid)!;
      throw new KeysUnavailable((err as Error).message);
    }
    return cache.keys.get(kid) ?? null;
  };
}

export function allowedEmails(env: Env): Set<string> {
  return new Set(Object.keys(usersOf(env)));
}

/** USERS var: "email:Name,email:Name". The only people allowed in, and the names shown on everything they do. */
export function usersOf(env: Env): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of (env.USERS ?? '').split(',')) {
    const [email, name] = part.split(':').map((x) => (x ?? '').trim());
    if (email && email.includes('@')) out[email.toLowerCase()] = name || nameFor(email);
  }
  return out;
}

export function userName(env: Env, email: string): string {
  return usersOf(env)[email.toLowerCase()] ?? nameFor(email);
}

export function nameFor(email: string): string {
  const local = email.split('@')[0].split(/[._+-]/)[0] || email;
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function cookie(request: Request, name: string): string | null {
  const header = request.headers.get('cookie') ?? '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}

const isLocal = (url: URL) => url.hostname === 'localhost' || url.hostname === '127.0.0.1';

/**
 * Local development sign-in. wrangler dev rewrites every request's URL to the
 * local address, so a page on any other hostname that DNS-rebinds to this
 * machine would otherwise count as local. A random token, set as a cookie by
 * /dev-login?t=<token> (npm run office:dev prints the link), is what proves
 * the browser is the developer's.
 */
export function devLogin(request: Request, env: Env): Response | null {
  const url = new URL(request.url);
  if (url.pathname !== '/dev-login' || !env.DEV_AUTH_EMAIL || !env.DEV_AUTH_TOKEN || !isLocal(url)) return null;
  if (url.searchParams.get('t') !== env.DEV_AUTH_TOKEN) return new Response('Wrong token', { status: 403 });
  return new Response(null, {
    status: 303,
    headers: { location: '/', 'set-cookie': `rco_dev=${env.DEV_AUTH_TOKEN}; Path=/; HttpOnly; SameSite=Strict` },
  });
}

export type AuthResult = { user: User } | { status: number; message: string };

export async function authenticate(request: Request, env: Env, keyFor?: KeyLookup): Promise<AuthResult> {
  const url = new URL(request.url);
  const allowed = allowedEmails(env);

  if (env.DEV_AUTH_EMAIL && isLocal(url)) {
    if (!env.DEV_AUTH_TOKEN || cookie(request, 'rco_dev') !== env.DEV_AUTH_TOKEN) {
      return { status: 403, message: 'Local console: open the /dev-login link that npm run office:dev printed.' };
    }
    const email = env.DEV_AUTH_EMAIL.toLowerCase();
    return { user: { email, name: userName(env, email) } };
  }

  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD || !allowed.size) {
    // Setup aid only: names the team the sign-in came from (unverified, never trusted) so it can be copied into the config.
    let seen = '';
    try {
      const t = request.headers.get('cf-access-jwt-assertion') || cookie(request, 'CF_Authorization');
      const iss = t ? String(b64urlJson(t.split('.')[1]).iss ?? '') : '';
      const m = /^https:\/\/([a-z0-9-]+\.cloudflareaccess\.com)$/.exec(iss);
      if (m && !env.ACCESS_TEAM_DOMAIN) seen = ` Your Cloudflare Access team domain is ${m[1]}.`;
    } catch { /* no usable token: nothing to add */ }
    return { status: 503, message: `The console is not set up yet: Cloudflare Access details or the USERS list are missing.${seen}` };
  }

  const token = request.headers.get('cf-access-jwt-assertion') || cookie(request, 'CF_Authorization');
  if (!token) return { status: 403, message: 'Sign in through Cloudflare Access to use the Back Office.' };

  let email: string;
  try {
    email = await verifyAccessJwt(token, {
      team: env.ACCESS_TEAM_DOMAIN,
      aud: env.ACCESS_AUD,
      keyFor: keyFor ?? teamKeys(env.ACCESS_TEAM_DOMAIN),
    });
  } catch (err) {
    if (err instanceof KeysUnavailable) {
      console.error('Access signing keys unavailable:', err.message);
      return { status: 503, message: "Couldn't reach Cloudflare to check your sign-in. Wait a minute and reload; nothing is wrong with your account." };
    }
    console.warn('Access token rejected:', (err as Error).message);
    return { status: 403, message: 'Your sign-in could not be verified. Sign in again.' };
  }
  if (!allowed.has(email)) {
    console.warn('Signed in but not on the allowed list:', email);
    return { status: 403, message: `${email} is not on the list of people allowed into the RCO Back Office. Ask Justin to add you.` };
  }
  return { user: { email, name: userName(env, email) } };
}

/**
 * State-changing requests must come from the Back Office's own pages. Access's
 * cookie would ride along on a cross-site form post; this stops that.
 */
export function sameOrigin(request: Request): boolean {
  const own = new URL(request.url).origin;
  const origin = request.headers.get('origin');
  if (origin && origin !== 'null') return origin === own;
  // No usable Origin (some privacy settings send "null"): fall back to the
  // browser's own same-origin signal. Anything else is refused.
  return request.headers.get('sec-fetch-site') === 'same-origin';
}
