import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp, writeFile, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { createApp } from '../server/app.js';

async function start(t, options) {
  const server = createApp(options).listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  }));
  return (path, options) => fetch(`http://127.0.0.1:${server.address().port}${path}`, options);
}

test('GET /api/health returns a healthy response without identifying Express', async t => {
  const request = await start(t);
  const response = await request('/api/health');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('x-powered-by'), null);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('guide collection and individual guides agree', async t => {
  const request = await start(t);
  const response = await request('/api/guides');
  assert.equal(response.status, 200);
  const { guides } = await response.json();
  assert.equal(guides.length, 4);
  assert.equal(new Set(guides.map(guide => guide.id)).size, guides.length);
  for (const guide of guides) {
    assert.ok(guide.title && guide.summary && guide.steps.length > 0);
    assert.equal(guide.example.length, 2);
    const response = await request(`/api/guides/${guide.id}`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { guide });
  }
});

test('unknown guides and API routes return JSON 404 errors', async t => {
  const request = await start(t);
  const guide = await request('/api/guides/missing');
  assert.equal(guide.status, 404);
  assert.deepEqual(await guide.json(), { error: 'Guide not found.' });
  const route = await request('/api/missing');
  assert.equal(route.status, 404);
  assert.deepEqual(await route.json(), { error: 'API route not found.' });
});

test('malformed guide IDs return a safe JSON 400 error', async t => {
  const request = await start(t);
  const response = await request('/api/guides/%ZZ');
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'Invalid request.' });
});

test('serves the built homepage and assets, with a plain 404 for unknown pages', async t => {
  const distDir = await mkdtemp(join(tmpdir(), 'form-website-test-'));
  const index = join(distDir, 'index.html');
  const asset = join(distDir, 'site.css');
  t.after(async () => {
    await Promise.all([unlink(index), unlink(asset)]);
    await rmdir(distDir);
  });
  await writeFile(index, '<h1>Google Form Auto Filler</h1>');
  await writeFile(asset, 'body { margin: 0; }');
  const request = await start(t, { distDir });
  const home = await request('/');
  assert.equal(home.status, 200);
  assert.match(home.headers.get('content-type'), /text\/html/);
  assert.match(await home.text(), /Google Form Auto Filler/);
  const stylesheet = await request('/site.css');
  assert.equal(stylesheet.status, 200);
  assert.match(stylesheet.headers.get('content-type'), /text\/css/);
  assert.equal(await stylesheet.text(), 'body { margin: 0; }');
  const missing = await request('/missing');
  assert.equal(missing.status, 404);
  assert.equal(await missing.text(), 'Page not found.');
});

test('a missing frontend build returns 503 and leaves the API available', async t => {
  const distDir = await mkdtemp(join(tmpdir(), 'form-website-unbuilt-'));
  t.after(() => rmdir(distDir));
  const request = await start(t, { distDir });
  const response = await request('/');
  assert.equal(response.status, 503);
  assert.match(await response.text(), /npm run build/);
  assert.equal((await request('/api/health')).status, 200);
});

test('unexpected errors return a generic message and are logged server-side', async t => {
  const errors = [];
  const request = await start(t, {
    distDir: 'relative-path',
    logger: { error: error => errors.push(error) }
  });
  const response = await request('/');
  assert.equal(response.status, 500);
  assert.equal(await response.text(), 'Internal server error.');
  assert.equal(errors.length, 1);
});
