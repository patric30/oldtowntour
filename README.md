# Munich Oldtown Tour

A 90-minute walking loop of Munich's old town. The copy speaks to whoever is holding
the phone, so it works either as a guide's prompt sheet or handed straight to the
group to follow themselves.

| # | Stop | Talk | Then walk |
|---|---|---|---|
| 1 | Marienplatz — Neues & Altes Rathaus, Mariensäule | 6 | 4 min · 260 m |
| 2 | Viktualienmarkt | 5 | 7 min · 450 m |
| 3 | Platzl — Hofbräuhaus + FC Bayern Store | 6 | 3 min · 160 m |
| 4 | Alter Hof — the Monkey Tower | 5 | 3 min · 130 m |
| 5 | Dallmayr | 3 | 3 min · 170 m |
| 6 | Max-Joseph-Platz — Residenz, Nationaltheater | 4 | 5 min · 300 m |
| 7 | Feldherrnhalle — Theatinerkirche, Viscardigasse | 6 | 6 min · 350 m |
| 8 | Café Luitpold | 3 | 11 min · 700 m |
| 9 | Frauenkirche | 4 | 5 min · 350 m |
| 10 | Marienplatz — close | 1 | — |

| | |
|---|---|
| Distance | 2.9 km |
| Walking, Google pace | 37 min |
| Walking, group pace (Google + 20%) | 47 min |
| Talking | 43 min |
| **Total** | **90 min** |

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

Built to be handed to the group and followed without a guide.

- **Tap *Listen* and the stop reads itself aloud** — every bullet, the
  *More interesting facts* material included, which is opened so you can see what is
  being read. The line being spoken lights up on the page, so you can follow along or
  pocket the phone and just listen. Web Speech: no network, no API key. Tap again to
  stop; starting another stop, or backgrounding the page, also stops it.

  Getting this reliable took three things, and it was broken without all of them:
  Chrome cuts a single utterance off at about 15 seconds, so the text is split into
  pieces of at most ~170 characters; an utterance with no live reference can be
  garbage-collected mid-sentence, so every one is kept reachable until the run ends;
  and the pieces are spoken one at a time rather than handed to the engine's queue in
  a batch. A watchdog advances the run if the engine ever goes quiet without ending an
  utterance — it re-arms while speech is genuinely running, so it can't cut a piece
  short.
- **A *Walk to …* button on every leg** that opens the Google Maps app straight into
  walking navigation for the next stop. It deliberately sends no origin, so Maps routes
  from wherever you are actually standing rather than from the last stop. A quieter
  *Preview the leg* link shows the full stop-to-stop route.
- **Turn-by-turn between stops**, plus something to read on the way.
- **An extended button that is always the next thing to do.** *Start tour*, then
  *Next: Viktualienmarkt*, *Next: Platzl*, all the way round. You never have to scroll
  to find it.
- **Orientation, not a schedule.** The banner says *Stop 3 of 10 · about 75 min to go*.
  The band under the app bar fills with the route you have actually walked — blue for
  stops, green for the walks between them. Nothing tells you off for being slow; it is
  a walk, not a train.
- **Survives a locked phone.** Progress is saved on the device; reopening the page
  drops you back at the stop you are standing at. Screen wake lock is held while the
  clock runs.
- **Two depths per stop.** The main bullets are the tour. *More interesting facts*
  opens the rest.

## Editing the tour

All content is in [`tour-data.js`](tour-data.js) — nothing else needs touching.

```js
say:   [ [ `written form`, `respelling for the voice` ] ]
stops: [ { num, name, sub, talkMin, maps, core: [], extra: [], flag } ]
legs:  [ { min, googleMin, meters, via, from, to, dest, steps: [], talk: [] } ]
```

`say` is a table of respellings handed to the speech synthesiser. An English voice
mangles German place names, so these are written to be *heard* correctly rather than
read correctly — they look wrong on purpose. Matching is case-insensitive and
longest-first, so `Dienerstraße` wins over the generic `straße`. Add a line whenever
you add a stop with a German name; anything left over gets its umlauts folded
(`ß`→`ss`, `ä`→`a`) so no voice chokes on it.

`dest` is the string handed to the Google Maps app by the *Walk to …* button. Every
one of them has been checked against Google's geocoder — a few plausible-looking
forms (`Dallmayr, Dienerstraße 14, München`, for one) silently fail to resolve, so
if you change a `dest`, open the URL and confirm Maps finds it before you rely on it.

`talkMin` and `min` are the minute budgets. They drive the band, the per-stop
deadlines and the ahead/behind maths, so if you change one, check the total still
lands on 90:

```bash
node -e "const f=require('fs');const T=(0,eval)(f.readFileSync('tour-data.js','utf8')+';TOUR');console.log(T.stops.reduce((a,s)=>a+s.talkMin,0)+T.legs.reduce((a,l)=>a+l.min,0),'min')"
```

`flag.type` is `time` (yellow) or `tip` (green) and sets both the colour and the icon
of the callout card. A red `warn` type still works if you want it, but nothing in the
tour uses one.

The four stat boxes at the top of the page are computed from this file at load time,
so they cannot drift out of sync with the route the way hand-written ones did.
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

The Glockenspiel runs at **17:00, March to October**, plus **11:00** and **12:00**
every day of the year. The 5pm show is the one to build around — easiest hour to
gather a group, and it opens the tour for you. It runs 12–15 minutes and is **not**
in the 90-minute budget: be on the square by 16:55, let it play, start the clock when
it finishes.

Dallmayr is a shop: closed Sundays, like all retail in Bavaria. Opening hours for
Café Luitpold and the Frauenkirche change; check them the morning of. The Alter Hof
courtyard is open and free, but Google routes you in over a short flight of steps —
go round by Burgstraße if anyone in the group is unsteady.

Altstadt streets close for markets and events — re-check the route the day before.
