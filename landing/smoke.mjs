import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from './server.mjs';

const tempDir = mkdtempSync(join(tmpdir(), 'fourpack-landing-'));
const eventsPath = join(tempDir, 'copy-events.jsonl');
const server = createApp({ eventsPath });

function listen(app) {
  return new Promise(resolve => {
    app.listen(0, '127.0.0.1', () => resolve(app.address()));
  });
}

function close(app) {
  return new Promise(resolve => app.close(resolve));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

try {
  const address = await listen(server);
  const baseUrl = `http://${address.address}:${address.port}`;

  const home = await fetch(baseUrl);
  assert(home.ok, `GET / failed with ${home.status}`);
  const homeText = await home.text();
  assert(homeText.includes('Fourpack'), 'home page missing Fourpack copy');
  assert(homeText.includes('setup-count'), 'home page missing setup counter');
  assert(homeText.includes('loop-count'), 'home page missing loop counter');

  for (const target of ['setup', 'loop']) {
    const response = await fetch(`${baseUrl}/api/copy`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ target })
    });
    assert(response.ok, `POST /api/copy ${target} failed with ${response.status}`);
  }

  const stats = await fetch(`${baseUrl}/api/stats`).then(response => response.json());
  assert(stats.setup === 1, `expected setup=1, got ${stats.setup}`);
  assert(stats.loop === 1, `expected loop=1, got ${stats.loop}`);

  const malformed = await fetch(`${baseUrl}/%E0%A4%A`);
  assert(malformed.status === 400, `expected malformed URL 400, got ${malformed.status}`);

  console.log('PASS landing smoke: home, copy setup, copy loop, stats, malformed URL');
} finally {
  await close(server);
  rmSync(tempDir, { recursive: true, force: true });
}

const mountedTempDir = mkdtempSync(join(tmpdir(), 'fourpack-landing-mounted-'));
const mountedEventsPath = join(mountedTempDir, 'copy-events.jsonl');
const mountedServer = createApp({
  eventsPath: mountedEventsPath,
  basePaths: ['/zh/fourpack', '/en/fourpack']
});

try {
  const address = await listen(mountedServer);
  const origin = `http://${address.address}:${address.port}`;

  const zhHome = await fetch(`${origin}/zh/fourpack`);
  assert(zhHome.ok, `mounted GET /zh/fourpack failed with ${zhHome.status}`);
  const zhHtml = await zhHome.text();
  assert(zhHtml.includes('两个起手式'), 'mounted zh home missing Chinese headline');
  assert(zhHtml.includes('/zh/fourpack/styles.css'), 'mounted zh home missing based stylesheet path');
  assert(zhHtml.includes('/zh/fourpack/app.js'), 'mounted zh home missing based script path');

  const enHome = await fetch(`${origin}/en/fourpack`);
  assert(enHome.ok, `mounted GET /en/fourpack failed with ${enHome.status}`);
  const enHtml = await enHome.text();
  assert(enHtml.includes('Two starter commands'), 'mounted en home missing English headline');
  assert(enHtml.includes('/en/fourpack/styles.css'), 'mounted en home missing based stylesheet path');
  assert(enHtml.includes('/en/fourpack/app.js'), 'mounted en home missing based script path');

  const bareHome = await fetch(`${origin}/fourpack`);
  assert(bareHome.status === 404, `expected bare /fourpack 404 from landing, got ${bareHome.status}`);

  const response = await fetch(`${origin}/zh/fourpack/api/copy`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ target: 'setup' })
  });
  assert(response.ok, `mounted zh POST /api/copy failed with ${response.status}`);

  const enResponse = await fetch(`${origin}/en/fourpack/api/copy`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ target: 'loop' })
  });
  assert(enResponse.ok, `mounted en POST /api/copy failed with ${enResponse.status}`);

  const stats = await fetch(`${origin}/en/fourpack/api/stats`).then(response => response.json());
  assert(stats.setup === 1, `mounted expected setup=1, got ${stats.setup}`);
  assert(stats.loop === 1, `mounted expected loop=1, got ${stats.loop}`);

  console.log('PASS landing mounted smoke: /zh/fourpack + /en/fourpack home, copy, stats');
} finally {
  await close(mountedServer);
  rmSync(mountedTempDir, { recursive: true, force: true });
}
