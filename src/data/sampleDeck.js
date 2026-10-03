export const SAMPLE_DECK_TITLE = "Curious creatures";

const LEVEL_WAIT_DAYS = { 1: 0, 2: 1, 3: 4, 4: 8 };

/** Bucket 1 is due today. Bucket 2 is due tomorrow. */
export const sampleActiveTime = (level = 1) => {
  const days = LEVEL_WAIT_DAYS[level] ?? 1;
  const date = new Date();
  date.setHours(9, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const sampleCard = (id, question, answer, level = 1) => ({
  id: String(id),
  question,
  answer,
  level,
  passed: false,
  activeTime: null,
  lastAnswered: null,
  answerHistory: [],
});

export const SAMPLE_CARDS = [
  sampleCard(0, "How many hearts does an octopus have?", "Three."),
  sampleCard(1, "What is a group of flamingos called?", "A flamboyance.", 2),
  sampleCard(
    2,
    "How do sea otters keep from drifting apart while they sleep?",
    "They hold hands.",
  ),
  sampleCard(3, "What shape is wombat poop?", "Cubes."),
  sampleCard(4, "Where is a shrimp’s heart?", "In its head.", 2),
  sampleCard(5, "Can axolotls regrow lost limbs?", "Yes."),
];

export const createSampleDeck = () => ({
  id: SAMPLE_DECK_TITLE,
  title: SAMPLE_DECK_TITLE,
  cards: SAMPLE_CARDS.map((card) => ({
    ...card,
    activeTime: sampleActiveTime(card.level),
    answerHistory: [],
  })),
  lastAccessed: null,
  lastTestedAt: null,
  lastTestedLabel: "Never tested",
  spacedLearning: null,
});
