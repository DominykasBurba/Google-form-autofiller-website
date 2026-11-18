const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const iconPackage = path.dirname(require.resolve('@fortawesome/fontawesome-free/package.json'));

const browser = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
].find(file => fs.existsSync(file));
if (!browser) throw Error('Set CHROME_PATH to a Chromium browser executable.');

const extension = path.resolve(process.argv[2] || path.join(__dirname, '../../Google forms'));
const output = path.join(__dirname, '../public/screenshots');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'autofill-screenshots-'));
const variants = [
  ['saved-answers', 'mainPage'],
  ['random-fill', 'listFillPage'],
  ['instructions', 'instructionsPage']
];

const storage = {
  formData: {
    'Workshop topics?': 'Accessibility, Forms',
    'Preferred contact method?': 'Email',
    'Your city?': 'Vilnius'
  },
  lists: { 'Test names': ['Alex', 'Jamie', 'Sam'], Cities: ['Vilnius', 'Kaunas', 'Klaipėda'] }
};

const mockChrome = `
const sampleStorage = ${JSON.stringify(storage)};
window.chrome = {
  runtime: {
    getURL(file) {
      const url = new URL(file, location.href);
      if (file.startsWith('popup.html?')) {
        url.searchParams.set('view', new URLSearchParams(location.search).get('view'));
      }
      return url.href;
    },
    onMessage: { addListener() {} }
  },
  storage: {
    sync: {
      get(keys, callback) { callback(sampleStorage); },
      set(values, callback) { callback?.(); }
    },
    local: {
      get(keys, callback) { callback({ drawerSize: "expanded" }); }
    }
  }
};
`;

const form = `<main>
  <header><h1>Workshop registration</h1><p>Tell us a little about yourself and what you’d like to learn.</p></header>
  <article><h2>Your city? <b>*</b></h2><div class="answer">Vilnius</div></article>
  <article><h2>Preferred contact method? <b>*</b></h2><label>◉ &nbsp; Email</label><label>◯ &nbsp; Phone</label></article>
  <article><h2>Workshop topics?</h2><label>☑ &nbsp; Accessibility</label><label>☐ &nbsp; Design systems</label><label>☑ &nbsp; Forms</label></article>
</main>`;

const fixture = `<!doctype html><meta charset="utf-8"><title>Google Form Auto Filler screenshot</title>
<style>
  *{box-sizing:border-box}body{margin:0;background:#f0ecf8;color:#25212c;font:16px system-ui,sans-serif}
  main{width:628px;margin:46px 0 0 78px}
  header,article{background:#fff;border:1px solid #e0dbe7;border-radius:9px;padding:22px 25px;margin-bottom:12px}
  header{border-top:8px solid #6946bd}h1{font-size:30px;margin:0 0 9px}p{margin:0;color:#595362}
  h2{font-size:16px;margin:0 0 16px}b{color:#b3261e}.answer{width:55%;border-bottom:1px solid #b7aebf;padding-bottom:7px}
  label{display:block;margin-top:9px}
</style>
${form}
<script src="sample-storage.js"></script><script src="ui.js"></script><script src="overlay.js"></script>
<script>
  window.AutoFillerOverlay.open();
  document.getElementById('google-form-auto-filler-overlay').shadowRoot.activeElement?.blur();
</script>`;

for (const file of [
  'popup.css', 'popup-components.css', 'popup-responsive.css', 'popup-actions.css',
  'overlay.css', 'overlay.js', 'ui.js', 'controls.js', 'drafts.js', 'popup-runtime.js', 'popup.js'
]) {
  fs.copyFileSync(path.join(extension, file), path.join(temp, file));
}
for (const dir of ['css', 'webfonts']) fs.mkdirSync(path.join(temp, dir));
for (const file of ['css/all.min.css', 'webfonts/fa-regular-400.woff2', 'webfonts/fa-solid-900.woff2']) {
  fs.copyFileSync(path.join(iconPackage, file), path.join(temp, file));
}
const popup = fs.readFileSync(path.join(extension, 'popup.html'), 'utf8')
  .replace(/https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css/, 'css/all.min.css')
  .replace('<script src="ui.js">', '<script src="sample-storage.js"></script><script src="ui.js">')
  .replace('</body>', `<script>document.addEventListener("DOMContentLoaded", () => {
    const view = new URLSearchParams(location.search).get("view");
    document.querySelector('[data-target="' + view + '"]').click();
  });</script></body>`);

fs.writeFileSync(path.join(temp, 'popup.html'), popup);
fs.writeFileSync(path.join(temp, 'sample-storage.js'), mockChrome);
fs.writeFileSync(path.join(temp, 'fixture.html'), fixture);
fs.mkdirSync(output, { recursive: true });

for (const [name, view] of variants) {
  const image = path.join(output, name + '.png');
  execFileSync(browser, [
    '--headless', '--no-sandbox', '--disable-gpu', '--no-first-run',
    '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1280,800',
    '--run-all-compositor-stages-before-draw', '--virtual-time-budget=3000',
    `--user-data-dir=${path.join(temp, 'profile-' + name)}`, `--screenshot=${image}`,
    pathToFileURL(path.join(temp, 'fixture.html')).href + '?view=' + view
  ], { timeout: 30000, windowsHide: true, stdio: 'pipe' });
  const png = fs.readFileSync(image);
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [1280, 800]);
  console.log(image);
}
