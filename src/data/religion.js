const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const RELIGION = [
  {
    slug: "ten-commandments",
    fieldLabel: "Ten commandments",
    headline: "What are the 10 commandments",
    description:
      "What are the 10 commandments: the list in Exodus and Deuteronomy, and why traditions number it differently. A sample deck and a spaced review schedule.",
    lede: "The text is in Exodus 20 and again in Deuteronomy 5. Jewish, Catholic, and many Protestant traditions divide that text into ten lines in different places. The words are shared. The numbering is not.",
    testsHeading: "The short answer",
    tests:
      "A common Protestant numbering is: no other gods, no idols, do not misuse the name of God, remember the Sabbath, honor your father and mother, do not murder, do not commit adultery, do not steal, do not bear false witness, and do not covet. Jewish tradition counts “I am the Lord your God” as the first line and joins the ban on other gods with the ban on idols. Catholic and Lutheran lists often join those opening lines and split coveting into two, the neighbor’s spouse and the neighbor’s goods.",
    cardRule:
      "One commandment per card, in the Protestant numbering named above. The other numberings get their own cards.",
    schedule: schedule("Start with where the text is, then the ten lines."),
    cards: [
      card("Where is the text?", "Exodus 20, and again in Deuteronomy 5."),
      card("What is a common first commandment in Protestant numbering?", "Have no other gods."),
      card("What is the idol commandment in that numbering?", "Do not make idols."),
      card("What does the Sabbath commandment ask?", "Remember the Sabbath day."),
      card("What does the commandment about parents ask?", "Honor your father and mother."),
      card("Which three commandments forbid murder, adultery, and theft?", "Do not murder. Do not commit adultery. Do not steal."),
      card("What is false witness?", "Lying about someone in a way that harms them, classically in a legal accusation."),
      card("How does a Catholic numbering often differ at the end?", "It splits coveting into two commandments and joins the opening lines about other gods and idols."),
    ],
  },
];

export function religionBySlug(slug) {
  return RELIGION.find((item) => item.slug === slug) ?? null;
}
