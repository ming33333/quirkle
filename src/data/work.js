const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const WORK = [
  {
    slug: "guards",
    fieldLabel: "Guards",
    headline: "What are the different types of guards?",
    description:
      "What are the different types of guards: security roles, sports positions, and machine guards. A sample deck and a spaced review schedule.",
    lede: "Guard is three different nouns. A security guard watches a place. A basketball guard is a position on the court. A machine guard is a cover that keeps hands out of moving parts. The sentence has to say which one.",
    testsHeading: "The short answer",
    tests:
      "Security work splits into a static post, a patrol that moves, and an event detail hired for one night. Armed and unarmed are licenses, and the rules are local. In basketball, a point guard runs the offense and a shooting guard is the other backcourt scorer. In American football, the guards are the two offensive linemen beside the center. A machine guard is a barrier on equipment. It is not a person.",
    cardRule:
      "One meaning per card. Security, sport, and machines do not share an answer.",
    schedule: schedule("Start with the three meanings of the word."),
    cards: [
      card("What are the three meanings of guard?", "A security worker, a sports position, and a barrier on a machine."),
      card("What is a static security guard?", "A person assigned to one post."),
      card("What is a patrol guard?", "A person who moves through a site on a route."),
      card("What is an event guard?", "Security hired for one gathering, not a permanent post."),
      card("What decides whether a security guard may carry a firearm?", "A local license. It is not part of the job title by itself."),
      card("What is a point guard?", "The basketball player who runs the offense."),
      card("What is a shooting guard?", "The other basketball backcourt player, usually a scorer."),
      card("What is a machine guard?", "A cover or barrier that keeps a person out of moving parts."),
    ],
  },
];

export function workBySlug(slug) {
  return WORK.find((item) => item.slug === slug) ?? null;
}
