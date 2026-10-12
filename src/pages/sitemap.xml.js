// Sitemap for search engines. Pages kept out of the Lab (noindex) are left out.
const EXCLUDE = ['/lab/banca-novera/'];

export async function GET({ site }) {
  const pages = import.meta.glob('./**/*.astro', { eager: false });
  const paths = Object.keys(pages)
    .map((f) => f.replace(/^\.\//, '/').replace(/\.astro$/, '/').replace(/\/index\/$/, '/').replace(/^\/index\/$/, '/'))
    .filter((p) => !p.includes('[') && p !== '/404/' && !EXCLUDE.includes(p))
    .sort();
  const today = new Date().toISOString().slice(0, 10);
  const urls = paths.map((p) => `  <url><loc>${new URL(p.replace(/^\//, ''), site).href}</loc><lastmod>${today}</lastmod></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
