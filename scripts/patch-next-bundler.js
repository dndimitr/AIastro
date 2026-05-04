#!/usr/bin/env node
// Patches Next.js bundler.js to default to webpack instead of Turbopack.
// Turbopack requires native bindings not available on this platform (linux/x64 WASM-only).
const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../node_modules/next/dist/lib/bundler.js'),
  path.join(__dirname, '../node_modules/next/dist/esm/lib/bundler.js'),
];

const FROM = `    // The default is turbopack when nothing is configured.
    if (bundlerFlags.size === 0) {
        process.env.TURBOPACK = 'auto';
        return 0;
    }`;

const TO = `    // The default is webpack (Turbopack requires native bindings unavailable on this platform).
    if (bundlerFlags.size === 0) {
        return 1;
    }`;

let patched = 0;
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const original = fs.readFileSync(file, 'utf8');
  if (original.includes(TO)) {
    console.log(`[patch-next-bundler] Already patched: ${path.basename(path.dirname(file))}/${path.basename(file)}`);
    continue;
  }
  if (!original.includes(FROM)) {
    console.warn(`[patch-next-bundler] Pattern not found in: ${file}`);
    continue;
  }
  fs.writeFileSync(file, original.replace(FROM, TO));
  console.log(`[patch-next-bundler] Patched: ${file}`);
  patched++;
}
if (patched > 0) console.log('[patch-next-bundler] Done. Next.js will now default to webpack.');
