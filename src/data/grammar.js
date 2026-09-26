const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const GRAMMAR = [
  {
    slug: "verb",
    fieldLabel: "Verb",
    headline: "What is a verb",
    description:
      "What is a verb: the word that says what the subject does or is. A sample deck and a spaced review schedule.",
    lede: "A verb is the word that says what the subject does, or what state it is in. Run, write, and is are verbs. A sentence in ordinary English needs one.",
    testsHeading: "The short answer",
    tests:
      "An action verb tells what happens: run, write, break. A linking verb joins the subject to a description: is, seem, become. A helping verb sits with a main verb and marks time or possibility: have, will, can. Tense is when the verb places the action. A noun names a person, place, or thing. The same spelling can be either, depending on the job it does in the sentence.",
    cardRule:
      "One job per card. Action, linking, and helping do not share an answer.",
    schedule: schedule("Start with the job of the verb, then the three kinds."),
    cards: [
      card(
        "What is a verb?",
        "The word that says what the subject does, or what state it is in.",
      ),
      card(
        "What is an action verb?",
        "A verb for something that happens, such as run or write.",
      ),
      card(
        "What is a linking verb?",
        "A verb that joins the subject to a description, such as is, seem, or become.",
      ),
      card(
        "What is a helping verb?",
        "A verb that goes with a main verb, such as have, will, or can.",
      ),
      card(
        "What is tense?",
        "The form of the verb that places the action in time.",
      ),
      card(
        "Does a sentence need a verb?",
        "In ordinary English, yes.",
      ),
      card(
        "How is a verb different from a noun?",
        "A noun names something. A verb says what happens or what state something is in.",
      ),
      card(
        "Can one spelling be both?",
        "Yes. Book is a noun in “the book” and a verb in “book a table.” The sentence decides.",
      ),
    ],
  },
  {
    slug: "adjective",
    fieldLabel: "Adjective",
    headline: "What is an adjective",
    description:
      "What is an adjective: a word that describes a noun. A sample deck and a spaced review schedule.",
    lede: "An adjective is a word that describes a noun or a pronoun. Red, tall, and wooden are adjectives. People also ask what an adjective is, with a question mark, and it is this same job.",
    testsHeading: "The short answer",
    tests:
      "An adjective can sit in front of the noun: the red car. It can follow a linking verb: the car is red. An adverb is the neighbor that gets mixed up with it. An adverb modifies a verb, an adjective, or another adverb: she runs quickly. Quickly is not an adjective. A, an, and the are determiners. Many classrooms teach them apart from adjectives.",
    cardRule:
      "One job per card. The adjective, the adverb, and the article stay separate.",
    schedule: schedule("Start with the noun it describes, then the two positions."),
    cards: [
      card(
        "What is an adjective?",
        "A word that describes a noun or a pronoun.",
      ),
      card(
        "Where can an adjective sit?",
        "In front of the noun, or after a linking verb.",
      ),
      card(
        "What is the adjective in “the red car”?",
        "Red. It describes car.",
      ),
      card(
        "What is the adjective in “the car is red”?",
        "Red. It follows the linking verb is.",
      ),
      card(
        "How is an adjective different from an adverb?",
        "An adjective describes a noun. An adverb modifies a verb, an adjective, or another adverb.",
      ),
      card(
        "Is quickly an adjective in “she runs quickly”?",
        "No. Quickly modifies runs, so it is an adverb.",
      ),
      card(
        "What is a comparative adjective?",
        "The form for comparing two things, such as taller.",
      ),
      card(
        "Are a, an, and the adjectives?",
        "They are determiners. Many grammars teach them separately from adjectives.",
      ),
    ],
  },
  {
    slug: "adjective-example",
    fieldLabel: "Examples",
    headline: "What is an adjective example",
    description:
      "What is an adjective example: red, tall, wooden, and where each one sits in a sentence. A sample deck and a spaced review schedule.",
    lede: "An adjective example is a word doing the job of describing a noun. The useful example includes the sentence, so you can see what the word describes.",
    testsHeading: "The short answer",
    tests:
      "Red in “the red car” describes car. Hot in “the soup is hot” describes soup after a linking verb. Wooden in “a wooden table” describes table. Two adjectives can stack: a small red car. Quickly in “she runs quickly” is not an example of an adjective. It modifies the verb.",
    cardRule:
      "One sentence per card. Name the adjective and the noun it describes.",
    schedule: schedule("Start with a word in front of a noun, then one after a linking verb."),
    cards: [
      card(
        "Give an adjective example in front of a noun.",
        "Red in “the red car.” Red describes car.",
      ),
      card(
        "Give an adjective example after a linking verb.",
        "Hot in “the soup is hot.” Hot describes soup.",
      ),
      card(
        "Give an adjective example for a material.",
        "Wooden in “a wooden table.” Wooden describes table.",
      ),
      card(
        "Can two adjectives describe one noun?",
        "Yes. Small and red in “a small red car.”",
      ),
      card(
        "What does the adjective have to point at?",
        "A noun or a pronoun. If it points at a verb, it is not an adjective.",
      ),
      card(
        "Is “quickly” an adjective example in “she runs quickly”?",
        "No. Quickly modifies runs.",
      ),
      card(
        "Is “happy” an adjective example in “the happy dog”?",
        "Yes. Happy describes dog.",
      ),
      card(
        "Is “blue” an adjective example in “the sky is blue”?",
        "Yes. Blue describes sky, after the linking verb is.",
      ),
    ],
  },
];

export function grammarBySlug(slug) {
  return GRAMMAR.find((item) => item.slug === slug) ?? null;
}
