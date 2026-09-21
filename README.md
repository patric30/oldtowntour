# Altstadt-Runde

A guide's cue sheet for a one-hour walking loop of Munich's old town. Built to be held
in one hand, outdoors, while talking to eight people.

**Marienplatz → Platzl → Max-Joseph-Platz → Odeonsplatz → Café Luitpold → Frauenkirche → Marienplatz**

| | |
|---|---|
| Distance | 2.4 km |
| Walking, Google pace | 32 min |
| Walking, group pace (Google + 20%) | 39 min |
| Talking | 21 min |
| **Total** | **60 min** |

Route, per-leg times and the turn-by-turn steps come from Google Maps walking
directions, checked September 2026.

## Design

Material 3, with Google's own M3 tokens seeded from Google Blue. The four brand
colours each carry one meaning, so the palette is information rather than decoration:

| | Role | Means |
|---|---|---|
| Blue `#0B57D0` | primary | a stop — you are standing still, talking |
| Green `#146C2E` | tertiary | a walk — you are moving, and you are on time |
| Red `#B3261E` | error | you are behind, or something needs watching |
| Yellow `#FBBC04` | custom *caution* | timing notes, mostly the Glockenspiel |

The stop / walk distinction runs through everything: filled cards with a numbered
blue avatar for stops, outlined cards on a dashed green connector for walks, and a
segmented progress bar that alternates blue and green as the hour goes by.

Type is Roboto, Roboto Flex (display) and Roboto Mono (clock and step numbers) — the
Material 3 type system. Google Sans isn't publicly distributed, so Roboto is the
correct stand-in rather than an approximation. Icons are Material Symbols Rounded.

Light and dark schemes are both defined. Light is the one you want in daylight.

## What it does

- **An extended FAB that is always the next thing to do.** It reads *Start tour*,
  then *Done — Marienplatz*, then *Done — Platzl*, all the way round. You never have
  to scroll to find the button.
- **Live tour clock.** Tap *Start tour*. The band under the app bar fills against the
  plan — blue while you're standing and talking, green while you're walking.
- **A deadline per stop.** Each stop shows the wall-clock time you need to leave it by.
- **Ahead / behind.** Mark each stop done and the status banner tells you where you
  stand. Green is fine, red means take a cut from the *Running late* panel.
- **Turn-by-turn between stops**, plus what to say while you're moving, plus a
  one-tap Google Maps link per leg.
- **Survives a locked phone.** Progress is saved locally; reopening the page drops you
  back at the stop you're standing at. Screen wake lock is held while the clock runs.
- **Two depths per stop.** The main bullets are the tour. *If you have time* opens the
  extra material for when you're running ahead.

## Editing the tour

All content is in [`tour-data.js`](tour-data.js) — nothing else needs touching.

```js
stops: [ { num, name, sub, talkMin, maps, core: [], extra: [], flag } ]
legs:  [ { min, googleMin, meters, via, from, to, steps: [], talk: [] } ]
```

`talkMin` and `min` are the minute budgets. They drive the band, the per-stop
deadlines and the ahead/behind maths, so if you change one, check the total still
lands on 60:

```bash
node -e "const f=require('fs');const T=(0,eval)(f.readFileSync('tour-data.js','utf8')+';TOUR');console.log(T.stops.reduce((a,s)=>a+s.talkMin,0)+T.legs.reduce((a,l)=>a+l.min,0),'min')"
```

`flag.type` is `time` (yellow), `warn` (red) or `tip` (green) and sets both the
colour and the icon of the callout card.
Basic HTML is allowed inside any content string.

## Running it locally

No build step, no dependencies. Serve the folder:

```bash
python3 -m http.server 4321
```

Then open http://localhost:4321.

## Deploying

Static site, no framework. Push to GitHub and import the repo at
[vercel.com/new](https://vercel.com/new) — leave the framework preset on **Other**
and every build field blank. Vercel serves the repo root. Hobby tier is plenty.

`vercel.json` only sets cache headers and two security headers.

## Before you walk it

The Glockenspiel plays at **11:00** and **12:00** daily, plus **17:00** March–October,
and runs 12–15 minutes. Start 20 minutes before one of those and let it open the tour,
or start after it finishes. Getting caught mid-tour costs the whole buffer.

Opening hours for Café Luitpold and the Frauenkirche change; check them the morning of.
Altstadt streets close for markets and events — re-check the route the day before.
