import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));

async function readProjectFile(...parts) {
  return readFile(join(projectRoot, ...parts), 'utf8');
}

test('homepage exposes the verification and search metadata', async () => {
  const html = await readProjectFile('index.html');
  assert.match(html, /google-site-verification/);
  assert.match(html, /ktP0Vm58Qv23drhi8dBb9saFKasST-yZckZbKohvuhk/);
  assert.match(html, /rel="canonical" href="https:\/\/formautofiller\.com\//);
  assert.match(html, /property="og:title"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /href="\/brand-icon\.svg"/);
  assert.match(html, /href="\/favicon\.png"/);
});

test('crawl files and verification file point to the production domain', async () => {
  const [robots, sitemap, verification] = await Promise.all([
    readProjectFile('public', 'robots.txt'),
    readProjectFile('public', 'sitemap.xml'),
    readProjectFile('public', 'google18c0928d85ca1fc4.html')
  ]);
  assert.match(robots, /Sitemap: https:\/\/formautofiller\.com\/sitemap\.xml/);
  for (const page of ['/', '/guides.html', '/privacy.html', '/terms.html', '/contact.html']) {
    assert.match(sitemap, new RegExp(`<loc>https:\\/\\/formautofiller\\.com${page.replace('.', '\\.')}</loc>`));
  }
  assert.equal(verification.trim(), 'google-site-verification: google18c0928d85ca1fc4.html');
});

test('public support pages have unique crawlable titles and canonicals', async () => {
  for (const page of ['guides', 'privacy', 'terms', 'contact']) {
    const html = await readProjectFile(`${page}.html`);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, new RegExp(`https:\\/\\/formautofiller\\.com\\/${page}\\.html`));
    assert.match(html, /<h1>[^<]+<\/h1>/);
  }
});
