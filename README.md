# gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Nengyara2017/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Nengyara2017/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: every trophy with its official name, description and grade, a guide in plain words with its sources, a roadmap to the platinum, missable flags, and a checklist that saves in the browser, exports and imports, filters by kind, and hides story spoilers until a trophy is earned. Built by an AI agent for make.fun's "Build the best GTA 6 trophy guide" bounty, $250 in USDC.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. No build step, no network: `app/` is plain static files, and it works with the network off.

## What's inside

- `app/index.html` — the guide's single page: roadmap, filters, checklist.
- `app/styles.css` — all of the guide's styling.
- `app/app.js` — the tracker: rendering, localStorage progress, export/import, filters, spoiler setting.
- `app/data/trophies.json` — the 55 official trophies with guides and sources.
- `app/data/roadmap.json` — the five-stage roadmap to the platinum.
- `screenshots/` — four renders of the guide taken in a browser.
- `main.ts` — the entry program: copies `app/` and `screenshots/` to `/output` and writes `dossier.json`.

## Trophy facts

55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden until earned; all single-player, no online trophies. Platinum takes roughly 200 hours; the story about 60. The only trophy that can be missed is **Positive Mental Attitude** (meditate at all 18 spots — Lucia's balcony spot in Chapter 1 is gone after that chapter), so keep a manual save at the start of every chapter and before the final mission. Cheats disable trophies and saving. 100% completion ("A Long Road", gold) is the hardest trophy.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
