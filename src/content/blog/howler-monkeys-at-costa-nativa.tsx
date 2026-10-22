import Link from "next/link";

import { Callout, Figure, StayCard } from "@/components/BlogParts";
import type { PostMeta } from "@/lib/blog";

import capuchin from "./images/capuchin.jpg";
import drySeason from "./images/dry-season-coast.jpg";
import iguana from "./images/garrobo-iguana.jpg";
import howlerCloseUp from "./images/howler-close-up.jpg";
import howlers from "./images/howler-mother-and-baby.jpg";
import magpieJay from "./images/magpie-jay.jpg";
import terrace from "./images/terrace-lounge.jpg";

/*
 * Facts checked 2026-10-22: howler call range (Natural Habitat Adventures'
 * Costa Rica wildlife guide; widely cited at up to ~5 km), the feeding ban
 * (Wildlife Conservation Law No. 7317, art. 116, via the Tico Times), the
 * Guanacaste tree as national tree (Enterolobium cyclocarpum), and the dry
 * season as the easiest time to spot wildlife in the bare forest
 * (Guanadreams' month-by-month guide). Claims about the garden itself stay
 * within what the house copy already states: birds, and most mornings,
 * monkeys. Everything else is framed as the area, not the property.
 */
export const meta: PostMeta = {
  slug: "howler-monkeys-at-costa-nativa",
  title: "Your neighbours are howler monkeys: a field guide to the Costa Nativa garden",
  description:
    "The 5am wake-up call, explained. A light-hearted guide to the howler monkeys you'll hear, the capuchins you might be lucky to spot, the iguanas and birds around Brasilito, and the one rule that matters.",
  date: "2026-10-22",
  minutes: 5,
  image: howlers,
  imageAlt: "A mantled howler monkey on a bare branch with a baby clinging to her side, golden-brown fringe along her flank",
};

export default function Body() {
  return (
    <>
      <p>
        At some point on your first morning, probably before you&apos;d like, you will hear
        something that sounds like a jet engine with opinions. Nobody is being murdered. Nothing is
        coming through the window. Those are the neighbours, and they&apos;re saying good morning.
      </p>
      <p>
        Costa Nativa sits on five thousand square metres of tall Guanacaste and Brasilito trees,
        and the trees are full of birds and, most mornings, monkeys. Here is a field guide to who
        you&apos;re likely to meet, written by people who have long since stopped setting alarms.
      </p>

      <Callout title="The one rule">
        <p>
          Look as much as you like. Never feed anything. It&apos;s illegal in Costa Rica, and a
          monkey that learns food comes from people is a monkey that ends up in trouble.
        </p>
      </Callout>

      <h2>The howler monkeys</h2>
      <p>
        The alarm clock. Mantled howlers are black, with a golden-brown fringe along their sides,
        and they are among the loudest land animals on earth: their calls carry for kilometres
        through the forest. They howl most enthusiastically around dawn, to tell the troop next
        door exactly whose trees these are.
      </p>
      <p>
        For all the noise, they are deeply relaxed animals. Howlers live mostly on leaves, which
        don&apos;t give them much energy, so they spend a large part of the day resting in the
        canopy. They are, in other words, the ideal holiday role model. Look up into the big trees
        in the early morning and late afternoon, and listen: they usually find you first.
      </p>
      <p>
        Practical tip, learned the traditional way: admire them from the side, not from directly
        underneath.
      </p>

      <Figure
        src={howlerCloseUp}
        alt="Close-up of a howler monkey with a baby on her back, half hidden behind green leaves"
        caption="Mantled howlers travel as families. The small one is not quieter, just smaller."
      />

      <h2>White-faced capuchins (if you&apos;re lucky)</h2>
      <p>
        Let&apos;s set expectations: the howlers are regulars, the capuchins are guest stars.
        They&apos;re harder to find around the house, and plenty of visitors go home without
        meeting one. If you do, count yourself lucky.
      </p>
      <p>
        If the howlers are the neighbours who play music too early, capuchins are the ones who
        borrow your things. They&apos;re small, quick, curious and very clever, with a pale face
        and shoulders on a black body, and they travel in busy groups that seem to be up to
        something. They are wonderful to watch and entirely unembarrassed about investigating an
        unattended snack. So if they do drop by, keep food indoors, and don&apos;t leave a bag of
        crisps on the terrace table as a test of character. They will pass.
      </p>

      <Figure
        src={capuchin}
        alt="A white-faced capuchin monkey sitting on a branch, pale face and shoulders on a black body, looking at the camera"
        caption="A white-faced capuchin, already planning something. (Illustration.)"
      />

      <h2>The tree that gave the province its name</h2>
      <p>
        The giant with the wide, umbrella-shaped crown is the guanacaste tree, Costa Rica&apos;s
        national tree and the namesake of the province you&apos;re standing in. In the dry season
        it drops curly brown seed pods shaped like an ear, which is why it is also called the ear
        tree. The monkeys use these trees as highways. You can use them as shade.
      </p>

      <h2>Iguanas, the pool-deck sunbathers</h2>
      <p>
        Guanacaste has plenty of iguanas, including the spiny-tailed kind that locals call{" "}
        <em>garrobo</em>. They spend the morning warming up on walls and warm stones and the
        afternoon looking unimpressed by everything. They are harmless if left alone and fast if
        approached, so admire them from a respectful distance and let them get on with their tan.
      </p>

      <Figure
        src={iguana}
        alt="A black spiny-tailed iguana basking on a warm grey stone among dry leaves"
        caption="A garrobo on a warm stone, doing exactly nothing, beautifully. (Illustration.)"
      />

      <h2>The birds</h2>
      <p>
        Guanacaste&apos;s dry forest is busy with birds, and the garden gets its share. The one
        you&apos;ll notice is the white-throated magpie-jay: bright blue, with a curly crest like a
        quiff, and the subtlety of a car alarm. In the evening, listen for parakeets screeching
        overhead on their way to roost, always in a hurry, always late. Bring binoculars if you
        have them. Bring coffee either way.
      </p>

      <Figure
        src={magpieJay}
        alt="A white-throated magpie-jay perched on a bare branch against a pale sky, blue back and very long tail, white throat with a thin black band, curly black crest"
        caption="A white-throated magpie-jay, surveying its territory and about to tell everyone about it."
      />

      <h2>Why you shouldn&apos;t feed anyone</h2>
      <p>
        It feels kind. It isn&apos;t. Feeding wild animals is against Costa Rica&apos;s Wildlife
        Conservation Law, and for good reason: human food makes them sick, and animals that learn
        to expect it lose their fear, become aggressive and end up in rescue centres they never
        leave. A banana handed to a monkey is a very short-term friendship. Put the fruit bowl
        inside and enjoy the show from the terrace.
      </p>

      <h2>How to see more</h2>
      <ul>
        <li>
          <strong>Go early.</strong> Dawn and the hour after are the busiest time in the trees.
          Late afternoon is a close second.
        </li>
        <li>
          <strong>Sit still.</strong> The terrace with a coffee beats any tour for the first
          hour of the day.
        </li>
        <li>
          <strong>Mind the season.</strong> In the dry season, roughly December to April, many
          trees drop their leaves and animals are easier to spot. In the green season the forest
          is lush and alive, and the birds are louder than ever.
        </li>
        <li>
          <strong>Want more?</strong> Guanacaste&apos;s national parks, such as Palo Verde and
          Rincón de la Vieja, make good day trips with a local guide.
        </li>
      </ul>

      <Figure
        src={drySeason}
        alt="Dry-season forest on the Guanacaste coast at sunset, many trees bare, a curved beach and bay below"
        caption="Dry season on the Guanacaste coast. With the leaves down, the forest has fewer places to hide a monkey."
      />

      <Figure
        src={terrace}
        alt="The covered terrace lounge at Costa Nativa, a blue sofa under two framed paintings, the garden beyond"
        caption="The observation deck. Binoculars optional, coffee recommended."
      />

      <p>
        So when the howling starts on your first morning, don&apos;t reach for the earplugs. Reach
        for the coffee, step out onto the terrace, and look up. Then go back to bed if you like.
        The monkeys certainly will. And if you&apos;d rather see the other end of the day, our{" "}
        <Link href="/en/blog/how-to-get-to-playa-conchal">guide to walking to Playa Conchal</Link>{" "}
        starts three minutes away.
      </p>

      <StayCard
        title="Wake up with the neighbours"
        body="Costa Nativa is a two-bedroom house with a private pool in Brasilito, set in five thousand square metres of Guanacaste trees. The monkeys are included. The alarm clock is not optional."
      />
    </>
  );
}
