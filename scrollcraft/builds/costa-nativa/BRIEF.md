# Costa Nativa — BRIEF

Interviewed 2026-10-22. Owner answers are quoted verbatim. Where the owner
skipped a question, the default taken is marked **(default)**.

## The eight topics

1. **Vibe.** "slow, warm, open, quietly expensive."
2. **Journey.** "reorder it however it makes sense for you. The desired outcome
   is for people to see the house and want to book it right away."
3. **Energy / the moment.** "the glass doors slide open as you scroll, the
   living room becomes the terrace, and the light shifts from day to dusk until
   the pool lights come on. We also want to do a tour of the bedrooms when
   showing the information about it. Resting in Costa Nativa is one highlight
   of the stay."
4. **Never seen elsewhere.** "scrolling moves the house from morning to night;
   a walk through the Jacques Hervot paintings as a gallery; the doors
   physically opening."
5. **Range.** "premium-minimal"
6. **World.** "the whole page feel like one walk through the property"
7. **Assets.** 16 real photos on the current site plus one unused drone shot of
   Playa Brasilito. "you can also generate some B-roll"
8. **Generation.** "you can generate things from the current images, but you
   can also generate from scratch when needed. Turn a few real photos into
   short, subtle motion clips, and throw out any clip that changes the
   building. The house needs to remain exactly as it is. let me know the
   amount of credits needed before executing."

Step 1 answers, from the existing site and README:

- **What / who.** A two-bedroom architect-designed house with a private pool in
  Brasilito, Guanacaste, rented on Airbnb. For couples, families and small
  groups (sleeps five).
- **Believe by the end.** "I want to be there, and I can book it now."
- **One action.** "Book on Airbnb", the same label everywhere.
- **Copy.** Keep every fact; tighten wording to fit the scroll **(default)**.
  Reviews verbatim and untranslated, as today.
- **Ship.** Next.js, EN + ES, same URLs and SEO; built on a branch with a
  Netlify deploy preview, live only after owner approval **(default)**.
- **Rating.** Checked live 2026-10-22: 4.96, 83 reviews, Superhost. Unchanged.

## Honesty rules (hard)

- The house is never invented or altered. Every room, door, wall and pool is a
  real photo or a clip that starts and ends on one. Any clip that changes the
  architecture is thrown out.
- Transitions between rooms are dissolves, never generated hallways: a
  generated corridor would be a part of the house that does not exist.
- Generated-from-scratch imagery is limited to things that are not the house:
  canopy, wildlife, light, water.
- No invented painting titles or dates. Hervot works are labelled only with
  facts the owner supplies.

## Grammar

**Continuous world** (worldflight mode). The brief is literally "one walk
through the property", which is travel through a real place. The other seven
lose: filmic one-shot and cutlist cut between scenes; editorial, poster and
gallery demote the house to illustration; live surface and split stage have no
product or two-sided argument here.

## Journey and feeling curve

The walk is also one day. Time of day is the spine.

| # | Time | Waypoint | Feeling | What causes it |
|---|---|---|---|---|
| 1 | 07:00 | Arrival | Curiosity | Layered hero: the house under its trees, morning haze, the camera easing toward the door |
| 2 | 07:30 | The trees | Calm | Canopy B-roll: light through Guanacaste trees, a howler monkey; the "second morning" line |
| 3 | 09:00 | Inside | Openness | The living room and kitchen, high ceilings, light from three sides |
| 4 | 12:00 | Pool | Ease | Water moving under the trees, the terrace beyond |
| 5 | 15:00 | The coast | Freedom | The Brasilito drone shot, three minutes away; distances |
| 6 | 17:00 | **Peak** | Awe | The doors slide open, the room becomes the terrace, the light falls to dusk, the pool lights come on |
| 7 | 19:00 | Gallery | Intimacy | The terrace at night, the Hervot works on the walls, labelled like a museum |
| 8 | 21:00 | Rest | Comfort | Bedroom tour: king, then queen and single, then bath. Soft lamplight |
| 9 | 22:00 | Arrival again | Resolve | The house lit at night, reviews, the facts, "Come and stay" and the button |

Authored silence: the end of leg 5 holds on open water for ~0.3vh with no copy,
so the peak has quiet to arrive from. This is intentional, not dead scroll.

## The peak

> "you scroll and the glass doors slide open, and then the whole room goes to
> dusk and the pool lights up."

Lives in leg 6. It gets the longest span on the page (two chained clips on one
fixed camera, frame-locked on the real photo), the best asset budget, and the
silence of leg 5 before it.

## Tell-someone sentence

It's the site where you spend a whole day in the house in one scroll, and when
the doors open the light falls to evening and the pool turns on.

## Signature move

**The sun rail.** The nav is the map this grammar requires, drawn as the sun's
arc across the day: 07:00 Arrival to 22:00 Rest. The sun travels the arc as you
scroll, the interface (ink, accent, scrim) regrades from morning to night with
it, and each hour is a clickable waypoint. Dragging the sun scrubs the day.

## Close

Arrival at the house at night, the same place the walk began. The booking
button is set in the lit doorway; reviews and facts arrive as windows over the
held final frame. Nothing fades to empty.

## As built (2026-10-22)

**Assets.** 5 stills and 10 clips on Higgsfield, 413.75 credits of the 414
approved, no rerolls. Every clip starts from a real photo except the canopy
B-roll, which starts from a generated still. Changes from the plan, all at no
cost:

- The doors-closed edit came back with dark door frames (the real ones are
  white), so it was not used. The doors clip instead starts on the real open
  photo, closes the doors, and plays reversed, so it ends exactly on the real
  photo where the dusk clip begins.
- The gallery clip panned past the photo's edge and invented terrace; only
  its first half ships, cropped.
- The night exterior grew an orange blob in the sky; cropped out.
- The hero's near plane (the cactus garden) was dropped: a colour key on thin
  spines read as translucent ghosts once it moved. The hero is three planes.

**Feel check** (contact sheet, cold, then diffed against the curve above):

| # | Intended | Felt |
|---|---|---|
| 1 | Curiosity | Welcome. Quieter than curiosity; the planes move gently |
| 2 | Calm | Calm, warm gold |
| 3 | Openness | Openness |
| 4 | Ease | Ease |
| 5 | Freedom | Freedom, the strongest colour on the page so far |
| 6 | Awe | The doors reveal, then the largest visual change on the sheet (day to dusk) |
| 7 | Intimacy | Intimacy |
| 8 | Comfort | Comfort |
| 9 | Resolve | Resolve: holds on "Come and stay" with the lit house |

Gap: the details panel (bathroom leg) reads as information, a flat beat
between comfort and resolve. Left in deliberately: the facts have to be
somewhere, and the panel is short. The peak is confirmed as the biggest change
and the longest continuous camera on the page.
