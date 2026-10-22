# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| costa-nativa (2026-10-22) | Continuous world (worldflight) | Sun-arc map rail at the foot of the screen: nine clickable hours, draggable sun, keyboard slider; top bar is wordmark, language, one CTA | Three photographic planes (generated sky, real house with sky keyed out, CSS morning haze); dark ink on the haze, centred | 12 legs, 13.4vh + 1: hero still, 10 photo-to-clip legs at one pace, one poster leg; peak = two clips chained on one locked camera (doors open, then dusk); one solid info panel leg | Arrival back at the house at night; CTA and footer in a left column over a deep scrim, held | The walk is one day: the rail is the sun's path and the whole chrome (sun, rail, every scrim) regrades from morning to night with scroll | Real-estate photographic, Guanacaste | Next.js 16 app, engine loaded via next/script |

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- **Continuous world over real interiors, chained on a locked camera at the peak** (costa-nativa). A second photo-led worldflight should find a different peak device.
- **Sun-arc / time-of-day rail as the map** (costa-nativa).
- **Whole-chrome regrade driven by scroll position as time of day** (costa-nativa).

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
