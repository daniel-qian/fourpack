# Fourpack landing

Tiny local landing page for Fourpack. It shows two copyable commands (the full setup and loop blocks, expandable in place) and a small public counter for those two copy actions.

## Local

```bash
cd landing
npm run start
```

Open http://127.0.0.1:4173.

The page shows the counts. To check the same numbers from a terminal:

```bash
curl -s http://127.0.0.1:4173/api/stats
```

Smoke check:

```bash
npm run smoke
```

Data lives in `landing/data/copy-events.jsonl` by default. In production, set `EVENTS_PATH`
to a persistent file such as `/var/lib/fourpack-landing/copy-events.jsonl`.

If the page is mounted under both localized ima-read paths, set:

```bash
BASE_PATHS=/zh/fourpack,/en/fourpack
```

This intentionally does not claim `/fourpack`; ima-read can keep its own locale redirect behavior there.

## Deploy Notes

Keep it boring:

- Run with Node 18+.
- Put Nginx in front for TLS and proxy to `127.0.0.1:4173`.
- Use systemd or a small process manager to run `npm run start`.
- Keep the events file outside the release directory, for example `/var/lib/fourpack-landing/copy-events.jsonl`.
- Back up the events file if the copy counts matter.

Example systemd shape:

```ini
[Service]
User=fourpack
WorkingDirectory=/srv/fourpack-landing
ExecStart=/usr/bin/node server.mjs
Restart=always
Environment=HOST=127.0.0.1
Environment=PORT=4173
Environment=BASE_PATHS=/zh/fourpack,/en/fourpack
Environment=EVENTS_PATH=/var/lib/fourpack-landing/copy-events.jsonl
```

View counts from inside the server:

```bash
curl -s "http://127.0.0.1:${PORT:-4173}/zh/fourpack/api/stats"
```

View counts after public routing is live:

```bash
curl -s https://app.ima-read.com/zh/fourpack/api/stats
```

The English page uses the same counter:

```bash
curl -s https://app.ima-read.com/en/fourpack/api/stats
```

Nginx should route only the localized Fourpack paths to this service, leaving the existing ima-read app to handle `/`, `/zh`, `/en`, and `/fourpack` redirects:

```nginx
location ~ ^/(zh|en)/fourpack(?:/.*)?$ {
  proxy_pass http://127.0.0.1:4173;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Overseas mirror (Vercel)

The same code also runs as an overseas mirror on Vercel for fast global access:
**https://fourpack.vercel.app** (→ redirects to `/zh`, English at `/en`).

- Vercel project: `kks-projects-84cf18eb/fourpack`, root directory `landing`,
  connected to GitHub `daniel-qian/4packs`. **Pushing to `main` auto-deploys.**
- `api/index.mjs` is a serverless function that reuses the exact same zh/en
  templating from `server.mjs` (see `createRequestListener`). `vercel.json`
  rewrites every path to it, so it serves pages, static assets, and the counter.
- The counter cannot use a local file on Vercel's ephemeral filesystem, and we
  don't want a new database. So `api/_store.mjs` is a **server-side proxy**: it
  forwards reads/writes to the authoritative China counter (`FOURPACK_UPSTREAM`,
  default `https://app.ima-read.com/zh/fourpack`). One counter, real numbers,
  no new datastore. If the upstream is briefly unreachable from Vercel's region,
  stats degrade to zeros and copy events are dropped rather than erroring.
- Optional env on the Vercel project: `BASE_PATHS` (default `/zh,/en`),
  `FOURPACK_UPSTREAM` (default as above).

From China you generally need a proxy to reach Vercel; the CLI honors it via
`NODE_USE_ENV_PROXY=1` plus `HTTP_PROXY`/`HTTPS_PROXY`.
