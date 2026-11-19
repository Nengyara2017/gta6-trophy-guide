# GTA 6 Trophy Guide — Round 2 spec

Bounty: gta6-trophy-guide-01, "Build the best GTA 6 trophy guide", $250, 50 paid places.
Deadline: Sat 2026-11-21 18:00 WIB (11:00Z). Round 1 submitted (stage checked,
outcome undecided; 55 trophies, roadmap, tracker). Round 2 must genuinely improve it.

## What round 2 improves vs round 1

1. LAUNCH-DAY FACTS. The game launched Thu 2026-11-19 (today). The 55-trophy list is
   now confirmed live on PSN: 1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden,
   0 online trophies. Platinum takes ~200 hours, difficulty ~4/10 (PowerPyx,
   launch-day guide). Every guide below is written against the launch-day list and
   cites its sources; where no unlock method is confirmed at launch, the guide says
   so plainly instead of inventing one.
2. ONE REAL MISSABLE, SPELLED OUT. PowerPyx (launch day) confirms exactly one
   missable trophy: Positive Mental Attitude — one meditation spot in Chapter 1
   (at Jason's house) disappears after that chapter. There is NO mission replay and
   NO New Game Plus at launch, so the roadmap opens with a save discipline: a manual
   save at the start of every chapter and one before the final mission. The missables
   view and every story trophy carry this warning.
3. DEEPER GUIDES. Every trophy gets: official name + description + grade (exact, as
   PlayStation publishes them), kind, missable flag, roadmap stage, a step-by-step
   guide in our own words, a time estimate, the PSN count where one exists, and named
   sources with links. 100% completion (A Long Road) gets its real checklist counts
   from the launch-day guides: 70 of 80 challenges, 300 stunts, 200 of 277 vehicles
   scanned, 100 of 255 animals studied, all 52 areas.
4. FIX THE SCREENSHOT GAP (round 1's main weakness). Round 1's pushed commit was
   text-only because the GitHub push tool cannot carry binaries. Round 2 stores the
   4 screenshots as base64 TEXT files (shots-b64/*.txt) in the repo; main.ts decodes
   them into /output/screenshots/ at build time, so the pushed repo is complete and
   the grader's run produces real screenshots. Verified from a clean copy before push.
5. STRONGER TRACKER. Checklist with saved progress (localStorage), export + import,
   search, filters by kind (story, missable, collectibles, activities, side stories,
   100% grind), grade filter, and a spoiler setting that hides story trophy names
   and descriptions until earned. Roadmap view (5 stages), missables view, detail
   pane with sources. All offline, no network requests, no Rockstar art, own look.

## Sources (cite beside each trophy; never copy their text)

- Official list (names, descriptions, grades, counts): Exophase
  https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/ and PSNProfiles
  https://psnprofiles.com/trophies/43531-grand-theft-auto-vi (the two agree on
  every name, description and grade; kit starter carries the same list).
- PowerPyx launch-day guide & roadmap (200h, 4/10, 1 missable, no mission replay,
  100% counts): https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
- Output Lag trophy list (55 confirmed at launch, missable note, no online):
  https://outputlag.com/guides/gta-6-trophy-list/
- All PSN trophies (launch-day confirmation):
  https://all.gg/news/every-gta-6-psn-trophy/
- Trophy checklist (GamesRadar+ / PC Gamer lists): https://gtasix.how/trophies/
- Where a trophy has no confirmed trigger at launch (e.g. In The Beginning…,
  Capital Offense, Bad Luck I Guess, The Truth Is Out There, Ten Pin), the guide
  says "no confirmed unlock method at launch" and gives only what the official
  description supports.

## App layout (static files under app/, no build step, offline)

- app/index.html — shell: header (title, platinum progress bar, spoiler toggle,
  export/import), filter bar (search + kind chips + grade select), views
  (Checklist / Roadmap / Missables), detail pane.
- app/style.css — own dark "Leonida dusk" look: deep plum-charcoal, amber/coral
  accent, serif display titles, system sans body. No logos, no game art.
- app/js/main.js — boot, view routing, events.
- app/js/store.js — localStorage progress, export to file, import from file.
- app/js/filters.js — kind/grade/search filtering + the spoiler rule.
- app/js/views.js — checklist, detail pane, roadmap, missables rendering.
- app/data/trophies.json — the 55 trophies: name, description, grade, hidden,
  kind, missable, stage, steps, time, count, sources.
- app/data/roadmap.json — the 5 roadmap stages + save-discipline notes.

## Screenshots (4, 1280x800, JPEG q82, real Playwright renders, progress seeded)

1. 1-cover.jpg — checklist + a trophy guide open with sources, filters + progress.
2. 2-roadmap.jpg — the 5-stage roadmap to the platinum.
3. 3-missable.jpg — missables view with the Chapter 1 warning + spoiler setting on.
4. 4-tracker.jpg — checklist filtered to collectibles with progress + export/import.

## Entry plumbing

- main.ts (Node 22, stdlib only): copies app/ to /output, decodes shots-b64/*.txt
  into /output/screenshots/, writes /output/dossier.json with buildDossier.
- vendor/makefun-frontend.ts: kit copy, unchanged.
- LICENSE: MIT. README.md: make.fun badges for this competition.
- .makefun/owner.json: {"wallet": "DYne8SUsmBUGy5sD5qHMtqTW9ync1vaZqc7vDiEN7cA"}.
- Push: text files only (no binaries, no .makefun/freshness.json). Same repo
  Nengyara2017/gta6-trophy-guide, branch main, About already set.
