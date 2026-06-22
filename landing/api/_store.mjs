// Counter store for the overseas (Vercel) mirror.
//
// Vercel functions run on an ephemeral filesystem, so the boring JSONL file
// store from server.mjs cannot persist counts there. Instead of introducing a
// database (out of scope per AGENTS.md without explicit backing), this store is
// a thin server-side proxy to the authoritative China deploy's counter API.
// One counter, real numbers, no new datastore.
//
// Reads/writes are best-effort: if the upstream is briefly unreachable from
// this region, stats degrade to zeros and copy events are dropped rather than
// failing the user's copy action.

const DEFAULT_UPSTREAM = 'https://app.ima-read.com/zh/fourpack';
const TIMEOUT_MS = 4000;
const EMPTY = { setup: 0, loop: 0 };

export function createProxyStore(upstream) {
  const base = (upstream || DEFAULT_UPSTREAM).replace(/\/+$/, '');

  return {
    async record(target) {
      try {
        await fetch(`${base}/api/copy`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ target }),
          signal: AbortSignal.timeout(TIMEOUT_MS)
        });
      } catch {
        // Best effort — the authoritative counter lives on the China deploy.
      }
    },
    async stats() {
      try {
        const res = await fetch(`${base}/api/stats`, {
          signal: AbortSignal.timeout(TIMEOUT_MS)
        });
        if (!res.ok) {
          return { ...EMPTY };
        }
        const data = await res.json();
        return { setup: Number(data.setup) || 0, loop: Number(data.loop) || 0 };
      } catch {
        return { ...EMPTY };
      }
    },
    close() {}
  };
}
