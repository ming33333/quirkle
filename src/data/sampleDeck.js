export const SAMPLE_DECK_TITLE = "Curious creatures";

const sampleCard = (id, question, answer) => ({
  id: String(id),
  question,
  answer,
  level: 1,
  passed: false,
  activeTime: null,
  lastAnswered: null,
  answerHistory: [],
});

export const SAMPLE_CARDS = [
  sampleCard(0, "How many hearts does an octopus have?", "Three."),
  sampleCard(1, "What is a group of flamingos called?", "A flamboyance."),
  sampleCard(
    2,
    "How do sea otters keep from drifting apart while they sleep?",
    "They hold hands.",
  ),
  sampleCard(3, "What shape is wombat poop?", "Cubes."),
  sampleCard(4, "Where is a shrimp’s heart?", "In its head."),
  sampleCard(5, "Can axolotls regrow lost limbs?", "Yes."),
];

export const createSampleDeck = () => ({
  id: SAMPLE_DECK_TITLE,
  title: SAMPLE_DECK_TITLE,
  cards: SAMPLE_CARDS.map((card) => ({
    ...card,
    answerHistory: [],
  })),
  lastAccessed: null,
  lastTestedAt: null,
  lastTestedLabel: "Never tested",
  spacedLearning: null,
});
