import Link from "next/link";

import { Callout, Figure, StayCard } from "@/components/BlogParts";
import type { PostMeta } from "@/lib/blog";

import beach from "./images/brasilito-beach.jpg";
import bay from "./images/guanacaste-bay.jpg";
import houseAtDusk from "./images/house-at-dusk.jpg";
import conchal from "./images/playa-conchal.jpg";
import shells from "./images/conchal-shell-sand.jpg";

/*
 * Facts checked 2026-10-22 against: MyTanFeet's Conchal guide (updated
 * 2026-10-21), Vamos Rent-A-Car's Conchal access guide (2025-10), and the
 * Tico Times on the shell law (2026-06-04). Parking prices drift; keep them
 * approximate.
 */
export const meta: PostMeta = {
  slug: "how-to-get-to-playa-conchal",
  title: "How to get to Playa Conchal (without your feet filing a complaint)",
  description:
    "You can't drive to Playa Conchal. Where to park in Brasilito, how long the beach walk takes, what is and isn't on the sand, and why the shells stay behind.",
  date: "2026-10-22",
  minutes: 6,
  image: conchal,
  imageAlt: "Playa Conchal from the trees above it, pale sand curving along clear turquoise water with a small boat moored offshore",
};

export default function Body() {
  return (
    <>
      <p>
        Playa Conchal is the beach on the postcard. The sand isn&apos;t really sand: it&apos;s
        millions of crushed shells, which is why the water in front of it turns that improbable
        turquoise. It is also, famously, a beach you cannot drive to. Unless you&apos;re staying at
        one of the resorts behind it, you arrive the old-fashioned way: on foot, along the next
        beach over.
      </p>
      <p>
        The good news is that the walk is lovely, it takes about as long as a podcast intro, and it
        starts in Brasilito, three minutes from our front gate. Here is everything we tell guests
        before they go.
      </p>

      <Callout title="The short version">
        <ul>
          <li>Drive to Brasilito and park in the town lot by the square.</li>
          <li>Walk left along Playa Brasilito for 15 to 20 minutes. Keep your shoes on.</li>
          <li>There are no toilets, showers or restaurants on Conchal. Bring water and cash.</li>
          <li>Swim near the rocks at the east end, and keep an eye on the waves.</li>
          <li>Take photos, not shells. Taking them is illegal.</li>
        </ul>
      </Callout>

      <h2>Can you drive to Playa Conchal?</h2>
      <p>
        Not really. The only paved access belongs to the resorts that back the beach (the Westin,
        the W and Reserva Conchal), and it&apos;s for their guests. There is a dirt road to the far
        end, through Puerto Viejo, where people park on the sand. It wants a high-clearance car, the
        parking isn&apos;t watched, and it brings you out at the end without the famous shells, about
        25 minutes&apos; walk from the good part. Almost everyone skips it, and so should you.
      </p>

      <h2>Where to park in Brasilito</h2>
      <p>
        Set your map to <strong>Brasilito Park</strong>, not &ldquo;Hotel Brasilito&rdquo;, which
        is a dead end and a three-point turn you didn&apos;t need. The public lot is in the centre
        of town, on your left just after the bridge, next to the square. Attendants in orange vests
        look after it for a few thousand colones for the day (around 3,000 last time we checked),
        so carry some cash. If the lot is full, there&apos;s street parking nearby.
      </p>
      <p>
        One rule for every beach car park in Costa Rica: leave nothing visible. Windows up, doors
        locked, the bag with your passport back at the house. It&apos;s the one piece of advice every
        beach in the country gives you for free.
      </p>

      <h2>The walk itself</h2>
      <p>
        From the car park, head to the beach and turn left with the ocean on your right. You&apos;ll
        walk the length of Playa Brasilito on darker, firmer sand, round the rocks at the end, and
        step onto Conchal&apos;s pale shells. Count on 15 to 20 minutes at holiday pace; more if
        you stop for every pelican.
      </p>
      <p>
        <strong>Keep your shoes on.</strong> By late morning the sand is hot enough to make you
        reconsider your life choices, and the shells at Conchal are sharp-edged underfoot. Sandals
        or water shoes are perfect. It&apos;s flat the whole way, so it works for children and
        anyone who isn&apos;t in the mood for a hike.
      </p>
      <Figure
        src={beach}
        alt="Aerial view of Playa Brasilito curving toward the rocky point, deep blue water and a small forested island offshore"
        caption="Playa Brasilito from above, the beach you walk along to reach Conchal."
      />

      <p>
        Go early. The light is softer, the sand is cooler, and you&apos;ll get first pick of the
        shade.
      </p>

      <h2>What&apos;s actually on the beach</h2>
      <p>
        Nothing built, and that&apos;s the point. There are no toilets, no showers, no changing
        rooms and no restaurants on Conchal. What you will find are local vendors renting chairs,
        canopies and snorkel gear near the rocks, and others walking the beach with cold drinks and
        food. Prices vary with the season and the haggling, so bring cash in small notes.
      </p>
      <p>
        Natural shade is scarce. Either rent a canopy, bring your own, or plan to retreat before
        midday and come back for the late afternoon light.
      </p>

      <h2>Swimming and snorkelling</h2>
      <p>
        The water is clear and warm, and the best snorkelling is at the east end, by the rocks
        where you arrive from Brasilito. At low tide, small pools form between the rocks and the
        fish are easy to find. You&apos;re not on a reef dive, but parrotfish and pufferfish are a
        fine way to spend an hour.
      </p>
      <p>
        Don&apos;t let the colour fool you into thinking it&apos;s a swimming pool. Waves can knock
        an adult off their feet, and rip currents form, especially as the tide changes. Swim where
        others are swimming, keep children within arm&apos;s reach, and if a current pulls you out,
        swim parallel to the shore until it lets go.
      </p>

      <Figure
        src={bay}
        alt="Aerial view of a forested Guanacaste headland and bay with clear blue-green water"
        caption="Clear water and forested headlands: the Guanacaste coast at its best."
      />

      <h2>The shells stay. Seriously.</h2>
      <p>
        Conchal has fewer shells than it used to, because for years people took them home. Under
        Costa Rica&apos;s Wildlife Conservation Law, removing shells, sand, coral or rocks from a
        beach is illegal. It can mean fines and, in the worst cases, a prison sentence, and the
        scanners at Liberia airport are set up to find them in luggage. A pocketful of shells is
        not worth a conversation with customs. Take photos.
      </p>

      <Figure
        src={shells}
        alt="Close-up of crushed shell fragments in white, cream and coral at the water's edge, with clear water washing over them"
        caption="What Conchal is made of, and why it stays there. (Illustration.)"
      />

      <h2>What to bring</h2>
      <ul>
        <li>Sandals or water shoes, for the hot sand and the shells.</li>
        <li>More water than you think, and a snack.</li>
        <li>Sunscreen, a hat and a shirt you can swim in.</li>
        <li>Cash in small notes for parking, chairs and drinks.</li>
        <li>Snorkel and mask, if you have them.</li>
        <li>A bag for your rubbish. There are no bins on the sand.</li>
      </ul>

      <h2>How we&apos;d do the day</h2>
      <p>
        Leave the house around eight, park in Brasilito by ten past, and be in the water before
        the sun gets serious. Snorkel the rocks, walk the length of the shells, and head back
        before midday. Lunch at one of the sodas in Brasilito, then home for the part of the day
        the{" "}
        <Link href="/en">house was built for</Link>: a long afternoon by your own pool, under
        the trees, with nobody selling you anything.
      </p>

      <Figure
        src={houseAtDusk}
        alt="Costa Nativa at dusk, the lit pool in front of the open living room"
        caption="The other end of the day. Costa Nativa is three minutes from the Brasilito car park."
      />

      <StayCard
        title="Three minutes from the Conchal walk"
        body="Costa Nativa is a two-bedroom house with a private pool in Brasilito, under five thousand square metres of trees. Close enough for an early start at Conchal, far enough that the afternoon is yours."
      />
    </>
  );
}
