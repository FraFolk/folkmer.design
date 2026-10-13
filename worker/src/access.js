import { EmailMessage } from 'cloudflare:email';
// Private case studies.
// 1. A visitor asks for access (name, email, reason). We create a personal code, save only its hash,
//    and email the request + the code to Francesca. The visitor gets nothing yet.
// 2. Francesca reads the request and, if she agrees, forwards the code from Gmail.
// 3. On the case page the visitor types the code: if it's valid (not expired, not revoked) we send back
//    the private HTML and a short-lived token for its images.
// Revoke a code: D1 > folkmer-wall > access_codes > set revoked = 1.
// The private HTML and images live in worker/protected/ (kept out of git: the site repo is public).
import creditAgricole from '../protected/credit-agricole.html';
import aon from '../protected/aon.html';

const CASES = {
  'credit-agricole': { title: 'Crédit Agricole: evolving the customer app', html: creditAgricole },
  aon: { title: 'Aon: joined to execute, ended up owning the design', html: aon },
};
const CODE_DAYS = 14;          // a code works for 14 days
const TOKEN_HOURS = 12;        // image links work for 12 hours after unlocking
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O, 1/I: easy to read and type

const clean = (v, n) => String(v || '').replace(/[\r\n]+/g, ' ').trim().slice(0, n);
const b64 = (str) => btoa(unescape(encodeURIComponent(str)));
const sha = async (s) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map((b) => b.toString(16).padStart(2, '0')).join('');
const normal = (code) => String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

function newCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const chars = [...bytes].map((b) => ALPHABET[b % ALPHABET.length]).join('');
  return `${chars.slice(0, 4)}-${chars.slice(4, 8)}`; // e.g. K7MP-Q2XR
}

async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}
const makeToken = async (env, slug, id) => {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_HOURS * 3600;
  return `${id}.${exp}.${await hmac(env.ACCESS_SECRET, `${slug}.${id}.${exp}`)}`;
};
async function checkToken(env, slug, token) {
  const [id, exp, sig] = String(token || '').split('.');
  if (!id || !exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return sig === (await hmac(env.ACCESS_SECRET, `${slug}.${id}.${exp}`));
}

// 1. Request access
export async function requestAccess(req, env, { json, ORIGINS, ipHash }) {
  if (!ORIGINS.includes(req.headers.get('Origin'))) return json(req, { error: 'origin' }, 403);
  let m; try { m = await req.json(); } catch { return json(req, { error: 'bad json' }, 400); }
  if (m.website) return json(req, { ok: true }); // honeypot
  const first = clean(m.first, 60), last = clean(m.last, 60), email = clean(m.email, 160);
  const company = clean(m.company, 120), reason = clean(m.reason, 600), page = clean(m.page, 60), all = m.all === true;
  if (!first || !last || !reason || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !CASES[page]) return json(req, { error: 'invalid' }, 400);
  const ip = await ipHash(req, 'access');
  const { results } = await env.DB.prepare("SELECT COUNT(*) AS n FROM access_codes WHERE ip_hash = ? AND created_at > datetime('now', '-1 day')").bind(ip).all();
  if (results[0].n >= 3) return json(req, { error: 'enough for today' }, 429);

  const code = newCode();
  const expires = new Date(Date.now() + CODE_DAYS * 864e5).toISOString().replace('T', ' ').slice(0, 19);
  const row = await env.DB.prepare('INSERT INTO access_codes (expires_at, code_hash, first_name, last_name, email, company, reason, page, ip_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(expires, await sha(normal(code)), first, last, email, company, reason, all ? 'all' : page, ip).run();
  const id = row.meta.last_row_id;
  const caseUrl = `https://folkmerdesign.com/work/${page}/`;
  const what = all ? `all the private cases (asked from "${CASES[page].title}")` : `"${CASES[page].title}"`;
  const text = [
    `${first} ${last} would like to see ${what}.`,
    '',
    `Email: ${email}`,
    `Company: ${company || '-'}`,
    `Why: ${reason}`,
    '',
    'If you agree, just hit Reply and send this (edit it as you like):',
    '----------------------------------------',
    `Hi ${first},`,
    '',
    all ? 'thanks for your interest! Here is your personal code: it opens all my private cases.' : 'thanks for your interest! Here is your personal code to read the full case:',
    '',
    `   ${code}`,
    '',
    `Open ${all ? 'https://folkmerdesign.com/#work' : caseUrl} and type it under the lock. It works until ${expires.slice(0, 10)}.`,
    all ? 'Please keep it to yourself: these projects are confidential.' : 'Please keep it to yourself: the project is confidential.',
    '',
    'Francesca',
    '----------------------------------------',
    '',
    `If you don't agree, ignore this email: the code works only if you send it.`,
    `To switch it off later: D1 > folkmer-wall > access_codes > row ${id} > revoked = 1.`,
  ].join('\n');
  const raw = [
    'From: Portfolio <portfolio@folkmerdesign.com>',
    'To: folkmer.design@gmail.com',
    `Reply-To: ${email}`,
    `Subject: =?UTF-8?B?${b64(`Access request: ${first} ${last} (${all ? 'all cases' : CASES[page].title})`)}?=`,
    `Message-ID: <${crypto.randomUUID()}@folkmerdesign.com>`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64(text),
  ].join('\r\n');
  try {
    await env.MAIL.send(new EmailMessage('portfolio@folkmerdesign.com', 'folkmer.design@gmail.com', raw));
    await env.DB.prepare('UPDATE access_codes SET sent = 1 WHERE id = ?').bind(id).run();
  } catch {
    return json(req, { ok: true, mailed: false });
  }
  return json(req, { ok: true, mailed: true });
}

// 3. Unlock with the code
export async function unlock(req, env, { json, ORIGINS, ipHash }) {
  if (!ORIGINS.includes(req.headers.get('Origin'))) return json(req, { error: 'origin' }, 403);
  let m; try { m = await req.json(); } catch { return json(req, { error: 'bad json' }, 400); }
  const slug = clean(m.page, 60);
  if (!CASES[slug]) return json(req, { error: 'not found' }, 404);
  // slow down guessing: max 10 wrong tries per day per IP
  const ip = await ipHash(req, 'unlock');
  const tries = await env.DB.prepare("SELECT COUNT(*) AS n FROM access_fails WHERE ip_hash = ? AND created_at > datetime('now', '-1 day')").bind(ip).all();
  if (tries.results[0].n >= 10) return json(req, { error: 'too many tries' }, 429);
  const rec = await env.DB.prepare("SELECT id FROM access_codes WHERE code_hash = ? AND revoked = 0 AND expires_at > datetime('now') AND (page = ? OR page = 'all')")
    .bind(await sha(normal(m.code)), slug).first();
  if (!rec) {
    await env.DB.prepare('INSERT INTO access_fails (ip_hash) VALUES (?)').bind(ip).run();
    return json(req, { error: 'wrong code' }, 401);
  }
  await env.DB.prepare("UPDATE access_codes SET uses = uses + 1, last_used_at = datetime('now') WHERE id = ?").bind(rec.id).run();
  const token = await makeToken(env, slug, rec.id);
  const base = new URL(req.url).origin;
  // images in the private HTML are written as src="asset:file.webp"
  const html = CASES[slug].html.replace(/<!--[\s\S]*?-->/g, '').replace(/asset:([\w.-]+)/g, (_, f) => `${base}/access/asset/${slug}/${f}?t=${token}`);
  return json(req, { ok: true, html });
}

// Private images: only with a valid token
export async function asset(req, env, slug, file, { json }) {
  if (!CASES[slug] || !(await checkToken(env, slug, new URL(req.url).searchParams.get('t')))) return json(req, { error: 'locked' }, 403);
  const res = await env.ASSETS.fetch(new Request(`https://assets.local/${slug}/${file}`));
  if (!res.ok) return json(req, { error: 'not found' }, 404);
  return new Response(res.body, { headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream', 'Cache-Control': 'private, max-age=3600', 'X-Robots-Tag': 'noindex' } });
}
