// GTA 6 trophy guide — the program that hands the entry in.
//
// This repository is a static web app: app/ holds the guide and tracker
// (plain HTML, CSS and ES modules, no build step, nothing fetched over the
// network), screenshots/ holds four renders of it taken in a browser, and
// this file copies both into the grader's output directory and writes
// dossier.json with the vendored make.fun library, exactly as the kit's
// starter does. vendor/makefun-frontend.ts is the kit's copy, unchanged:
// the scorer rebuilds the dossier with its own copy and compares bytes.
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (Node 22; the runtime runs TypeScript directly, standard library only.)

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's caps (from the kit's reference gate): at most 4 screenshots,
// each at most 256 KiB; app/ at most 993 files and directories and 48 MiB;
// the dossier text at most 160 KiB. Anything past those limits is refused
// by buildDossier before it is written, so a bad entry fails loudly here.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
