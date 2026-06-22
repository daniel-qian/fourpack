// Vercel serverless entry for the overseas mirror.
//
// vercel.json rewrites every path to this function, so it serves exactly what
// the China deploy serves (zh/en pages, static assets, the copy counter) —
// just rendered per-request instead of by a long-running Node process. The
// only difference is the counter store, which proxies to the China deploy
// (see _store.mjs) instead of writing a local JSONL file.

import { createRequestListener } from '../server.mjs';
import { createProxyStore } from './_store.mjs';

const basePaths = (process.env.BASE_PATHS ?? '/zh,/en')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean);

const handler = createRequestListener({
  store: createProxyStore(process.env.FOURPACK_UPSTREAM),
  basePaths
});

export default function (req, res) {
  return handler(req, res);
}
