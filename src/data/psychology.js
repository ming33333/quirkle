const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const PSYCHOLOGY = [
  {
    slug: "personality",
    fieldLabel: "Personality",
    headline: "What are the types of personality",
    description:
      "What are the types of personality: the Big Five dimensions, and why a 16-type quiz is a different tool. A sample deck and a spaced review schedule.",
    lede: "Research describes personality as dimensions, not boxes. The Big Five are the dimensions with the strongest evidence. A popular quiz that sorts people into 16 types is a different tool, and it is not a diagnosis.",
    testsHeading: "The short answer",
    tests:
      "The Big Five are openness, conscientiousness, extraversion, agreeableness, and neuroticism. Each is a range. A person sits somewhere on each range, and the mix can shift with age and situation. MBTI sorts people into 16 letter types. It is widely used and weakly supported as a measurement. Type A and Type B are an older popular split about hurry and competitiveness. They are not the Big Five. No serious account says a person is only one type.",
    cardRule:
      "One dimension or one tool per card. A quiz result is not a diagnosis.",
    schedule: schedule("Start with the five names."),
    cards: [
      card("What are the Big Five?", "Openness, conscientiousness, extraversion, agreeableness, and neuroticism."),
      card("Is each one a box?", "No. Each is a range. A person sits somewhere on it."),
      card("What is openness?", "How much a person seeks new ideas and experiences."),
      card("What is conscientiousness?", "How organized and reliable a person tends to be."),
      card("What is extraversion?", "How much a person seeks stimulation from other people and from activity."),
      card("What is neuroticism in this list?", "How strongly a person tends to feel unpleasant emotion."),
      card("What is MBTI?", "A quiz that sorts people into 16 letter types. It is not a clinical diagnosis."),
      card("What is Type A?", "An older popular label for hurry and competitiveness. It is not one of the Big Five."),
    ],
  },
];

export function psychologyBySlug(slug) {
  return PSYCHOLOGY.find((item) => item.slug === slug) ?? null;
}
