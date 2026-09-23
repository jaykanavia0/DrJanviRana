// Package the static site without publishing source documents or local notes.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const files = new Set(['index.html']);
const external = value => /^(?:[a-z]+:|\/\/|#)/i.test(value);
function include(value, from = 'index.html') {
  if (!value || external(value)) return;
  const clean = decodeURIComponent(value.split(/[?#]/)[0]);
  if (!clean) return;
  const resolved = clean.startsWith('/') ? path.resolve(root, '.' + clean) : path.resolve(root, path.dirname(from), clean);
  const relative = path.relative(root, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw Error(`Asset outside site: ${value}`);
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) throw Error(`Missing asset in ${from}: ${value}`);
  files.add(relative);
}
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (!html.includes('data-gp-glyph') || !html.includes('js/glyph-portal.js') || /virtual|telehealth|online consultation/i.test(html)) {
  throw Error('Expected the approved MOVE hero and home-visits-only entry page.');
}
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) include(match[1]);
// Sets iterate newly discovered CSS/script dependencies too.
for (const file of files) {
  const text = /\.(css|js|html)$/.test(file) ? fs.readFileSync(path.join(root,file),'utf8') : '';
  if (file.endsWith('.css')) {
    for (const match of text.matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/g)) include(match[1],file);
  }
  if (file.endsWith('.js')) {
    new vm.Script(text, { filename: file });
    // Runtime image URLs are resolved by the browser relative to index.html.
    for (const match of text.matchAll(/['"]([^'"\n]+\.(?:png|jpe?g|webp|svg|gif|mp4|woff2?))['"]/gi)) include(match[1]);
  }
}
// Validate every dependency before touching an existing output folder.
if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw Error('Unsafe build path');
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const file of files) {
  const destination = path.join(output, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root,file), destination);
}
console.log(`Built ${files.size} static files in dist; index.html is copied byte-for-byte.`);
