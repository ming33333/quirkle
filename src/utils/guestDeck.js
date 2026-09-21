import { createSampleDeck, SAMPLE_DECK_TITLE } from "../data/sampleDeck";
import {
  applyCardAnswer,
  assertValidDeckTitle,
  createDeckForUser,
  fetchDecksForUser,
  formatLastTestedLabel,
  MAX_QUESTIONS_PER_DECK,
} from "./decks";

const STORAGE_KEY = "quirkle.guestDeck";

const nextQuestionKey = (cards) => {
  const used = new Set((cards || []).map((card) => String(card.id)));
  let next = 0;
  while (used.has(String(next))) next += 1;
  return String(next);
};

const emptyLocalCard = (key, question = "", answer = "") => ({
  id: key,
  question,
  answer,
  level: 1,
  passed: false,
  activeTime: null,
  lastAnswered: null,
  answerHistory: [],
});

const readStorage = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.cards)) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveGuestDeck = (deck) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
  } catch (error) {
    console.warn("Could not keep the sample deck on this device.", error);
  }
  return deck;
};

export const clearGuestDeck = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures; the tab session is already ending.
  }
};

export const peekGuestDeck = () => readStorage();

export const hasGuestDeckSession = () => Boolean(peekGuestDeck());

export const loadGuestDeck = () => {
  const stored = peekGuestDeck();
  if (stored) return stored;
  return saveGuestDeck(createSampleDeck());
};

export const addGuestCard = (deck) => {
  const cards = deck?.cards || [];
  if (cards.length >= MAX_QUESTIONS_PER_DECK) {
    throw new Error(
      `A deck can have at most ${MAX_QUESTIONS_PER_DECK} questions.`,
    );
  }
  const key = nextQuestionKey(cards);
  const card = emptyLocalCard(key);
  const next = {
    ...deck,
    cards: [...cards, card],
    lastAccessed: new Date().toISOString(),
  };
  saveGuestDeck(next);
  return { deck: next, card };
};

export const addGuestCards = (deck, pairs = []) => {
  if (!pairs.length) {
    throw new Error("Paste question and answer pairs first.");
  }
  const cards = deck?.cards || [];
  const room = MAX_QUESTIONS_PER_DECK - cards.length;
  if (room <= 0) {
    throw new Error(
      `A deck can have at most ${MAX_QUESTIONS_PER_DECK} questions.`,
    );
  }
  const toAdd = pairs.slice(0, room);
  const used = new Set(cards.map((card) => String(card.id)));
  let nextKey = 0;
  const takeKey = () => {
    while (used.has(String(nextKey))) nextKey += 1;
    const key = String(nextKey);
    used.add(key);
    nextKey += 1;
    return key;
  };
  const added = toAdd.map((pair) =>
    emptyLocalCard(takeKey(), pair.question, pair.answer),
  );
  const next = {
    ...deck,
    cards: [...cards, ...added],
    lastAccessed: new Date().toISOString(),
  };
  saveGuestDeck(next);
  return {
    deck: next,
    cards: added,
    truncated: pairs.length - toAdd.length,
  };
};

export const updateGuestCardText = (deck, cardId, { question, answer }) => {
  const next = {
    ...deck,
    cards: (deck?.cards || []).map((card) =>
      card.id === cardId
        ? {
            ...card,
            question: String(question ?? ""),
            answer: String(answer ?? ""),
          }
        : card,
    ),
    lastAccessed: new Date().toISOString(),
  };
  saveGuestDeck(next);
  return next;
};

export const updateGuestDeckTitle = (deck, title) => {
  const trimmed = assertValidDeckTitle(title);
  const next = {
    ...deck,
    title: trimmed,
    lastAccessed: new Date().toISOString(),
  };
  saveGuestDeck(next);
  return next;
};

export const deleteGuestCard = (deck, cardId) => {
  const next = {
    ...deck,
    cards: (deck?.cards || []).filter((card) => card.id !== cardId),
    lastAccessed: new Date().toISOString(),
  };
  saveGuestDeck(next);
  return next;
};

export const recordGuestCardAnswer = (deck, card, choice) => {
  const updatedCard = applyCardAnswer(card, choice);
  const lastTestedAt = updatedCard.lastAnswered;
  const next = {
    ...deck,
    cards: (deck?.cards || []).map((item) =>
      item.id === updatedCard.id ? updatedCard : item,
    ),
    lastAccessed: lastTestedAt,
    lastTestedAt,
    lastTestedLabel: formatLastTestedLabel(lastTestedAt),
  };
  saveGuestDeck(next);
  return { deck: next, card: updatedCard };
};

const uniqueDeckTitle = (base, existingIds) => {
  const used = new Set(existingIds);
  let title = base;
  let n = 2;
  while (used.has(title)) {
    title = `${base} ${n}`;
    n += 1;
  }
  return title;
};

export const claimGuestDeck = async (email) => {
  if (!email) {
    return { skipped: true, reason: "missing" };
  }
  const deck = peekGuestDeck();
  if (!deck) {
    return { skipped: true, reason: "missing" };
  }

  const existingDecks = await fetchDecksForUser(email);
  const title = uniqueDeckTitle(
    deck.title || SAMPLE_DECK_TITLE,
    existingDecks.map((item) => item.id),
  );

  try {
    const created = await createDeckForUser(email, title, { cards: deck.cards });
    clearGuestDeck();
    return { skipped: false, deckId: created.id };
  } catch (error) {
    if (String(error.message || "").includes("Free accounts can keep")) {
      clearGuestDeck();
      return { skipped: true, reason: "limit" };
    }
    throw error;
  }
};
