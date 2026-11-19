// Leonida Ledger — a GTA 6 trophy guide entry (Node 22, standard library only).
// The guide itself is plain static files in app/ (index.html, ES modules, CSS,
// data/trophies.json with the official 55 trophies and cited guides), opened at
// app/index.html, offline: it loads nothing over the network.
// This program hands the guide in: it copies app/ from beside this file to
// /output, rebuilds the screenshots there, and writes /output/dossier.json, the
// summary the judge reads, with the vendored make.fun library. Leave
// vendor/makefun-frontend.ts as it is: the scorer requires dossier.json to be
// byte for byte what its own copy writes.
//
// Screenshots: the GitHub push tool cannot carry binary files, so this entry
// stores its four screenshots as base64 TEXT in shots-b64/ (one .txt file per
// shot, named like the JPEG it holds). The decode below is lossless — the bytes
// written to /output/screenshots/ are the exact renders the maker took of the
// app in a headless browser. That is why the pushed repository is complete
// even though no binary file was ever pushed through the connector.
//
// Serve the guide locally with any static server rooted at app/,
// then open http://localhost:8080. Outside the grader's container,
// MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });

// Rebuild the screenshots from their base64 text files: the pushed repo holds
// no binaries, so the grader's run decodes them here, deterministically.
const shotsDir = join(here, 'shots-b64');
const outShots = join(out, 'screenshots');
mkdirSync(outShots, { recursive: true });
if (!existsSync(shotsDir)) throw new Error('shots-b64/ is missing: the entry has no screenshots to hand in');
const shotTexts = readdirSync(shotsDir).filter((f) => f.endsWith('.txt')).sort();
if (shotTexts.length < 3 || shotTexts.length > 4) throw new Error(`expected 3 or 4 screenshots in shots-b64/, found ${shotTexts.length}`);
for (const textFile of shotTexts) {
  const jpegName = `${basename(textFile, '.txt')}.jpg`;
  const encoded = readFileSync(join(shotsDir, textFile), 'utf8').replace(/\s+/g, '');
  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.length === 0) throw new Error(`empty screenshot: shots-b64/${textFile}`);
  writeFileSync(join(outShots, jpegName), bytes);
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
