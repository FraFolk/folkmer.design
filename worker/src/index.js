import { EmailMessage } from "cloudflare:email";
import { requestAccess, unlock, asset, setDays } from "./access.js";
// Visitors' wall for folkmerdesign.com: stores drawing strokes in D1.
// Visitors can add strokes and undo/erase only their own (each stroke has a private key kept in their browser).
// Francesca removes strokes from the Cloudflare dashboard (D1 > folkmer-wall > strokes).
const ORIGINS = ['https://folkmerdesign.com', 'https://www.folkmerdesign.com', 'http://folkmerdesign.com', 'http://localhost:4321'];
const MAX_POINTS = 2000, MAX_PER_DAY = 200;
const clean = (v, n) => String(v || '').replace(/[\r\n]+/g, ' ').trim().slice(0, n);
const b64 = (str) => btoa(unescape(encodeURIComponent(str)));

// Contact form: saves the message and forwards it to Francesca's inbox (Cloudflare Email Routing).
async function contact(req, env) {
  if (!ORIGINS.includes(req.headers.get('Origin'))) return json(req, { error: 'origin' }, 403);
  let m; try { m = await req.json(); } catch { return json(req, { error: 'bad json' }, 400); }
  if (m.website) return json(req, { ok: true }); // honeypot: bots fill hidden fields
  const name = clean(m.name, 80), company = clean(m.company, 120), topic = clean(m.topic, 300), email = clean(m.email, 160);
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(req, { error: 'invalid' }, 400);
  const ip = await hash((req.headers.get('CF-Connecting-IP') || '') + 'contact' + new Date().toISOString().slice(0, 10));
  const { results } = await env.DB.prepare("SELECT COUNT(*) AS n FROM messages WHERE ip_hash = ? AND created_at > datetime('now', '-1 day')").bind(ip).all();
  if (results[0].n >= 5) return json(req, { error: 'enough for today' }, 429);
  const body = `Hi Francesca, I'm ${name}${company ? ` from ${company}` : ''}. I'd love to talk about ${topic || 'anything'}. You can reach me at ${email}.`;
  const row = await env.DB.prepare('INSERT INTO messages (ip_hash, name, company, topic, email, body) VALUES (?, ?, ?, ?, ?, ?)').bind(ip, name, company, topic, email, body).run();
  const raw = [
    'From: Portfolio <portfolio@folkmerdesign.com>',
    'To: folkmer.design@gmail.com',
    `Reply-To: ${email}`,
    `Subject: =?UTF-8?B?${b64(`Portfolio: hi from ${name}`)}?=`,
    `Message-ID: <${crypto.randomUUID()}@folkmerdesign.com>`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64(`${body}\n\nName: ${name}\nCompany: ${company || '-'}\nTopic: ${topic || '-'}\nEmail: ${email}\n\nSent from the form on folkmerdesign.com. Just hit Reply to answer.`),
  ].join('\r\n');
  try {
    await env.MAIL.send(new EmailMessage('portfolio@folkmerdesign.com', 'folkmer.design@gmail.com', raw));
    await env.DB.prepare('UPDATE messages SET sent = 1 WHERE id = ?').bind(row.meta.last_row_id).run();
  } catch (e) {
    // the message is saved anyway; it can be read in D1 > messages
    return json(req, { ok: true, mailed: false });
  }
  return json(req, { ok: true, mailed: true });
}

const cors = (req) => {
  const o = req.headers.get('Origin');
  return { 'Access-Control-Allow-Origin': ORIGINS.includes(o) ? o : ORIGINS[0], 'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' };
};
const json = (req, body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...cors(req) } });
const hash = async (s) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
// IPv6: one person easily gets a whole /64 network, so count the network, not the single address
const network = (ip) => {
  if (!ip.includes(':')) return ip;
  const [head, tail = ''] = ip.split('::');
  const h = head ? head.split(':') : [], t = tail ? tail.split(':') : [];
  const full = [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill('0'), ...t];
  return full.slice(0, 4).map((x) => x.toLowerCase().replace(/^0+(?=.)/, '')).join(':') + '::/64';
};
const okColour = (c) => /^#[0-9a-f]{6}$/i.test(c);

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors(req) });
    if (url.pathname === '/contact' && req.method === 'POST') return contact(req, env);
    // private case studies (see access.js)
    const helpers = { json, ORIGINS, ipHash: (r, salt) => hash(network(r.headers.get('CF-Connecting-IP') || '') + salt + new Date().toISOString().slice(0, 10)) };
    if (url.pathname === '/access/request' && req.method === 'POST') return requestAccess(req, env, helpers);
    if (url.pathname === '/access/unlock' && req.method === 'POST') return unlock(req, env, helpers);
    const d = url.pathname.match(/^\/access\/days\/(\d+)\/(\d+)$/);
    if (d && (req.method === 'GET' || req.method === 'POST')) return setDays(req, env, d[1], d[2]);
    const a = url.pathname.match(/^\/access\/asset\/([\w-]+)\/([\w.-]+)$/);
    if (a && req.method === 'GET') return asset(req, env, a[1], a[2], helpers);
    const del = url.pathname.match(/^\/strokes\/(\d+)$/);
    if (del && req.method === 'DELETE') {
      const key = url.searchParams.get('key') || '';
      if (key.length < 16) return json(req, { error: 'key' }, 403);
      const r = await env.DB.prepare('DELETE FROM strokes WHERE id = ? AND key_hash = ?').bind(Number(del[1]), await hash(key)).run();
      return json(req, { deleted: r.meta.changes });
    }
    if (url.pathname !== '/strokes') return json(req, { error: 'not found' }, 404);
    if (req.method === 'GET') {
      const { results } = await env.DB.prepare('SELECT id, data FROM strokes ORDER BY id DESC LIMIT 3000').all();
      return json(req, results.reverse().map((r) => ({ id: r.id, ...JSON.parse(r.data) })));
    }
    if (req.method === 'POST') {
      if (!ORIGINS.includes(req.headers.get('Origin'))) return json(req, { error: 'origin' }, 403);
      let s; try { s = await req.json(); } catch { return json(req, { error: 'bad json' }, 400); }
      const pts = Array.isArray(s.pts) ? s.pts : [];
      if (!pts.length || pts.length > MAX_POINTS || !pts.every((p) => Array.isArray(p) && p.length === 2 && p.every((n) => typeof n === 'number' && n >= -0.05 && n <= 1.05))) return json(req, { error: 'bad stroke' }, 400);
      if (!okColour(s.colour) || typeof s.size !== 'number' || s.size < 1 || s.size > 40 || typeof s.alpha !== 'number' || s.alpha < 0.1 || s.alpha > 1) return json(req, { error: 'bad style' }, 400);
      const ip = await hash((req.headers.get('CF-Connecting-IP') || '') + new Date().toISOString().slice(0, 10));
      const { results } = await env.DB.prepare("SELECT COUNT(*) AS n FROM strokes WHERE ip_hash = ? AND created_at > datetime('now', '-1 day')").bind(ip).all();
      if (results[0].n >= MAX_PER_DAY) return json(req, { error: 'enough for today' }, 429);
      const data = JSON.stringify({ pts: pts.map(([x, y]) => [Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000]), colour: s.colour.toLowerCase(), size: s.size, alpha: s.alpha });
      const key = typeof s.key === 'string' && s.key.length >= 16 ? s.key : '';
      const r = await env.DB.prepare('INSERT INTO strokes (ip_hash, key_hash, data) VALUES (?, ?, ?)').bind(ip, key ? await hash(key) : null, data).run();
      return json(req, { id: r.meta.last_row_id });
    }
    return json(req, { error: 'method' }, 405);
  },
};
