/* Social feed for the home page carousel. Ported from backcountrydrones.com.
 *
 * FACEBOOK: the Page's own posts through the Graph API, using a Page access
 * token (secret FB_PAGE_TOKEN) and the Page id or handle (var FB_PAGE_ID).
 * Setup is the same 12 steps documented in backcountrydrones.com
 * worker/social.ts; the BCD Meta app can be reused if Justin is an admin of
 * the Red Creek Page (add the Red Creek Page to the app's login configuration
 * assets, then pull its token from /me/accounts).
 *
 * TIKTOK: TikTok has no public API for an account's posts. Instead, list
 * video links in var TIKTOK_VIDEOS (comma separated). Each link is resolved
 * through TikTok's public oEmbed endpoint for its title and thumbnail. No
 * token needed.
 *
 * WHY NOT EMBED WIDGETS: Meta's and TikTok's embeds load their trackers on
 * every visitor and render empty under ad blockers. Pulling server side and
 * drawing our own cards avoids both.
 *
 * The cron refreshes KV (binding SOCIAL) every two hours. /api/social serves
 * the cache. If anything upstream fails, the last good copy stays.
 */

const GRAPH = 'https://graph.facebook.com/v26.0';
const KV_KEY = 'feed:v1';
const MAX_POSTS = 12;
const MAX_TEXT = 260;

export interface SocialPost { id: string; network: 'facebook' | 'tiktok'; url: string; text: string; image?: string; createdAt?: string }
export interface SocialFeed { posts: SocialPost[]; fetchedAt: string }
export interface SocialEnv { SOCIAL?: KVNamespace; FB_PAGE_TOKEN?: string; FB_PAGE_ID?: string; TIKTOK_VIDEOS?: string }

function trim(t: string | undefined, max = MAX_TEXT): string {
  if (!t) return '';
  const flat = t.replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const sp = cut.lastIndexOf(' ');
  return `${cut.slice(0, sp > max * 0.6 ? sp : max)}...`;
}

async function facebookPosts(env: SocialEnv): Promise<SocialPost[]> {
  if (!env.FB_PAGE_TOKEN || !env.FB_PAGE_ID) return [];
  const qs = new URLSearchParams({
    fields: 'id,message,story,created_time,permalink_url,full_picture,attachments{media}',
    limit: '15',
    access_token: env.FB_PAGE_TOKEN,
  });
  const res = await fetch(`${GRAPH}/${env.FB_PAGE_ID}/posts?${qs}`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Graph ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data: any = await res.json();
  return (data?.data ?? [])
    .map((p: any): SocialPost => ({
      id: `fb_${p.id}`,
      network: 'facebook',
      url: p.permalink_url ?? `https://www.facebook.com/${p.id}`,
      text: trim(p.message ?? p.story),
      // Attachment image is ~720px; full_picture can be 2048px. Prefer the small one.
      image: p?.attachments?.data?.[0]?.media?.image?.src || p.full_picture || undefined,
      createdAt: p.created_time,
    }))
    .filter((p: SocialPost) => p.text || p.image);
}

async function tiktokPosts(env: SocialEnv): Promise<SocialPost[]> {
  const urls = (env.TIKTOK_VIDEOS || '').split(',').map((u) => u.trim()).filter((u) => /^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+/.test(u)).slice(0, 12);
  const out = await Promise.allSettled(
    urls.map(async (u): Promise<SocialPost> => {
      const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(u)}`);
      if (!res.ok) throw new Error(`oembed ${res.status}`);
      const d: any = await res.json();
      return { id: `tt_${u.split('/').pop()}`, network: 'tiktok', url: u, text: trim(d.title), image: d.thumbnail_url };
    })
  );
  return out.filter((r): r is PromiseFulfilledResult<SocialPost> => r.status === 'fulfilled').map((r) => r.value);
}

export async function buildFeed(env: SocialEnv): Promise<SocialFeed> {
  const [fb, tt] = await Promise.allSettled([facebookPosts(env), tiktokPosts(env)]);
  const fbPosts = fb.status === 'fulfilled' ? fb.value : [];
  const ttPosts = tt.status === 'fulfilled' ? tt.value : [];
  // Facebook is dated, TikTok links are in the order listed. Interleave so both show.
  const posts: SocialPost[] = [];
  const fbSorted = fbPosts.sort((a, b) => Date.parse(b.createdAt || '') - Date.parse(a.createdAt || ''));
  for (let i = 0; posts.length < MAX_POSTS && (i < fbSorted.length || i < ttPosts.length); i++) {
    if (fbSorted[i]) posts.push(fbSorted[i]);
    if (ttPosts[i] && posts.length < MAX_POSTS) posts.push(ttPosts[i]);
  }
  if (!posts.length) {
    const why = [fb, tt].filter((r): r is PromiseRejectedResult => r.status === 'rejected').map((r) => String(r.reason)).join(' | ');
    throw new Error(why || 'no posts configured');
  }
  return { posts, fetchedAt: new Date().toISOString() };
}

export async function refreshFeed(env: SocialEnv): Promise<void> {
  if (!env.SOCIAL) return;
  try {
    await env.SOCIAL.put(KV_KEY, JSON.stringify(await buildFeed(env)));
  } catch (err) {
    console.error('social refresh failed:', err);
  }
}

export async function handleSocial(env: SocialEnv, ctx: ExecutionContext): Promise<Response> {
  const headers = { 'content-type': 'application/json', 'cache-control': 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400' };
  let feed: SocialFeed | null = null;
  if (env.SOCIAL) {
    const cached = await env.SOCIAL.get(KV_KEY);
    if (cached) feed = JSON.parse(cached);
  }
  if (!feed) {
    try {
      feed = await buildFeed(env);
      if (env.SOCIAL) ctx.waitUntil(env.SOCIAL.put(KV_KEY, JSON.stringify(feed)));
    } catch {
      return new Response(null, { status: 204, headers });
    }
  }
  return new Response(JSON.stringify(feed), { headers });
}
