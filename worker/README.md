# folkmer-wall

Cloudflare Worker + D1 behind the visitors' whiteboard on folkmerdesign.com.

- API: https://folkmer-wall.folkmerdesign.workers.dev/strokes
- Deploy: `npx wrangler deploy` (from this folder)
- Remove a drawing: Cloudflare dashboard → Storage & databases → D1 → folkmer-wall → strokes → delete the row.
