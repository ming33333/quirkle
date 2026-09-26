const card = (question, answer) => ({ question, answer });

export const LEARN_AI = {
  slug: "ai",
  fieldLabel: "AI",
  headline: "How to learn AI",
  description:
    "How to learn AI: the words and the workflow to put on flashcards first, a sample deck, and a spaced review schedule.",
  lede: "The news moves faster than a study plan. Learn what a model does, then the few words that show up in every explanation. Tools change. These terms stay.",
  testsHeading: "What to memorize first",
  tests:
    "Training versus inference, a token, overfitting, and what a prompt actually is. You do not need a research paper to use a model, and you do not need a tool tutorial to know what the model is doing.",
  cardRule:
    "One term per card, in a sentence you could say out loud. A card that needs a product name will be stale next month. The idea is the card.",
  schedule:
    "Start with training, inference, and token. A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.",
  cards: [
    card(
      "What is a model?",
      "A program that learned patterns from examples and uses them on something new.",
    ),
    card(
      "What is training?",
      "Adjusting the model on examples so it gets better at a task.",
    ),
    card(
      "What is inference?",
      "Using a trained model on a new input, such as answering a question.",
    ),
    card(
      "What is a token?",
      "A chunk of text the model reads or writes. A word may be one token or several.",
    ),
    card(
      "What is overfitting?",
      "The model memorized the training examples and does worse on new ones.",
    ),
    card(
      "What is a neural network?",
      "Layers of simple calculations whose weights are set by training.",
    ),
    card(
      "What is a prompt?",
      "The instruction and the context you give the model at inference time.",
    ),
    card(
      "What is a parameter?",
      "A number inside the model that training sets. More parameters is not the same thing as a correct answer.",
    ),
  ],
};
