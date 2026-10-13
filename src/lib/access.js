// Shared helpers for private case studies (see worker/src/access.js).
export const API = import.meta.env.DEV ? 'http://localhost:8787' : 'https://folkmer-wall.folkmerdesign.workers.dev';

// The code is XXXX-XXXX: the dash goes in by itself after the first 4 characters
export function formatCode(input) {
  input.addEventListener('input', () => {
    const raw = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    input.value = raw.length > 4 ? `${raw.slice(0, 4)}-${raw.slice(4)}` : raw;
  });
}

const key = (slug) => `pc:${slug}`;
export const savedCode = (slug) => { try { return sessionStorage.getItem(key(slug)); } catch { return null; } };

// Returns { ok: true, html } or { ok: false, message }
export async function unlock(slug, code) {
  try {
    const res = await fetch(`${API}/access/unlock`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: slug, code }) });
    const data = await res.json();
    if (!res.ok) {
      try { sessionStorage.removeItem(key(slug)); } catch {}
      return { ok: false, message: res.status === 429 ? 'Too many tries for today. Try again tomorrow, or ask me for help.' : "That code doesn't work. It may have expired: ask me for a new one." };
    }
    try { sessionStorage.setItem(key(slug), code); } catch {}
    return { ok: true, html: data.html };
  } catch {
    return { ok: false, message: "I can't reach the server right now. Try again in a minute." };
  }
}
