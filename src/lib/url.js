// Prefix a site path with the configured base (GitHub Pages project sites live under /repo-name/).
export function url(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return `${base}/${path.replace(/^\//, '')}`;
}
