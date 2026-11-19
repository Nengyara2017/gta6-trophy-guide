# Leonida Ledger — GTA 6 Trophy Guide & Tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/Nengyara2017/gta6-trophy-guide/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/Nengyara2017/gta6-trophy-guide/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

The best offline guide and tracker for all **55 Grand Theft Auto VI trophies** on PlayStation 5 — built for the [make.fun bounty gta6-trophy-guide-01](https://make.fun/c/gta6-trophy-guide-01).

- **Every trophy, official and cited**: all 55 names, descriptions and grades as PlayStation publishes them (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden, 0 online), each with a guide in our own words and named sources.
- **Tracker**: a checklist saved in the browser, with search, filters by kind (story, missable, collectibles, activities, side stories, crime & world), a grade filter, export to file and import back.
- **Spoiler-free mode**: hides story trophy names and descriptions until you earn them.
- **Roadmap to the platinum**: 5 stages, ~200 hours, built from the official descriptions — including the game's one missable trophy (Positive Mental Attitude: the Chapter 1 meditation spot) and the save discipline it forces, since there is no mission replay at launch.
- **Offline**: static files under `app/`, no network requests, no Rockstar artwork. Serve `app/` with any static server and open `index.html`.

## Run it

```sh
# serve app/ and open http://localhost:8080
python3 -m http.server 8080 --directory app
# or: node serve.ts (not included; any static server works)
```

## Hand it in

`main.ts` (Node 22) copies `app/` to `/output`, decodes the four screenshots from their base64 text files in `shots-b64/` into `/output/screenshots/`, and writes `/output/dossier.json`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots are stored as base64 text because the GitHub push tool cannot carry binaries; the decode is lossless, so the pushed repository is complete.

## License

MIT — see `LICENSE`. Unofficial fan guide, not affiliated with Rockstar Games.
