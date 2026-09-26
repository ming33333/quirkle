const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const HISTORY = [
  {
    slug: "seven-wonders",
    fieldLabel: "Seven wonders",
    headline: "What are the 7 wonders of the world",
    description:
      "What are the 7 wonders of the world: the ancient seven, and how that list differs from the 2007 vote. A sample deck and a spaced review schedule.",
    lede: "The phrase usually means the Seven Wonders of the Ancient World. Hellenistic writers settled on seven famous works in the Mediterranean. A 2007 public vote made a different list. That vote is not the ancient one.",
    testsHeading: "The short answer",
    tests:
      "The ancient seven are the Great Pyramid of Giza, the Hanging Gardens of Babylon, the Statue of Zeus at Olympia, the Temple of Artemis at Ephesus, the Mausoleum at Halicarnassus, the Colossus of Rhodes, and the Lighthouse of Alexandria. The pyramid is the one that still largely stands. The Hanging Gardens are the one historians still argue may never have stood as described. The 2007 list people also call the new seven wonders is the Great Wall of China, Petra, Christ the Redeemer, Machu Picchu, Chichén Itzá, the Colosseum, and the Taj Mahal.",
    cardRule:
      "One wonder per card. The ancient list and the 2007 list do not share an answer.",
    schedule: schedule("Start with the pyramid, then the one that may be a story."),
    cards: [
      card("Which ancient wonder still largely stands?", "The Great Pyramid of Giza."),
      card("Which ancient wonder’s existence is still argued?", "The Hanging Gardens of Babylon."),
      card("Where was the Statue of Zeus?", "Olympia."),
      card("Where was the Temple of Artemis?", "Ephesus."),
      card("What was the Mausoleum at Halicarnassus?", "The tomb of Mausolus. The word mausoleum comes from his name."),
      card("Where did the Colossus stand?", "Beside the harbor at Rhodes, not across the harbor mouth."),
      card("What was the Lighthouse of Alexandria also called?", "The Pharos."),
      card("Name the 2007 list in one breath.", "Great Wall, Petra, Christ the Redeemer, Machu Picchu, Chichén Itzá, the Colosseum, and the Taj Mahal."),
    ],
  },
];

export function historyBySlug(slug) {
  return HISTORY.find((item) => item.slug === slug) ?? null;
}
