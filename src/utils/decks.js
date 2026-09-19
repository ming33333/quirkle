import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  assertQuestionLimit,
  canCreateDeck,
  FREE_PLAN_MAX_DECKS,
  getVerifiedSubscriptionStatus,
  MAX_QUESTIONS_PER_DECK,
} from "./subscription";

const ANSWER_HISTORY_CAP = 40;

const countQuestions = (questions) => {
  if (!questions) return 0;
  if (Array.isArray(questions)) return questions.length;
  return Object.keys(questions).length;
};

const normalizeAnswerHistory = (history) => {
  if (!Array.isArray(history)) return [];
  return history
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const at = entry.at ? String(entry.at) : "";
      const result = entry.result === "right" ? "right" : "wrong";
      const from = Math.min(4, Math.max(1, parseInt(entry.from, 10) || 1));
      const to = Math.min(4, Math.max(1, parseInt(entry.to, 10) || from));
      if (!at) return null;
      return { at, result, from, to };
    })
    .filter(Boolean)
    .slice(-ANSWER_HISTORY_CAP);
};

const normalizeQuestions = (questions) => {
  if (!questions) return [];
  if (Array.isArray(questions)) {
    return questions.map((question, index) => ({
      ...question,
      id: String(question?.mapIndex ?? question?.originalIndex ?? index),
      question: String(question?.question ?? "").trim(),
      answer: String(question?.answer ?? "").trim(),
      level: Math.min(4, Math.max(1, parseInt(question?.level, 10) || 1)),
      passed: Boolean(question?.passed),
      activeTime: question?.activeTime ?? null,
      lastAnswered: question?.lastAnswered ?? null,
      answerHistory: normalizeAnswerHistory(question?.answerHistory),
    }));
  }

  return Object.entries(questions)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([key, question]) => ({
      ...question,
      id: String(question?.mapIndex ?? question?.originalIndex ?? key),
      question: String(question?.question ?? "").trim(),
      answer: String(question?.answer ?? "").trim(),
      level: Math.min(4, Math.max(1, parseInt(question?.level, 10) || 1)),
      passed: Boolean(question?.passed),
      activeTime: question?.activeTime ?? null,
      lastAnswered: question?.lastAnswered ?? null,
      answerHistory: normalizeAnswerHistory(question?.answerHistory),
    }));
};

const DEFAULT_LEVEL_DAYS = { 1: 2, 2: 4, 3: 8, 4: 16 };

const getLevelSchedule = async () => {
  try {
    const snapshot = await getDoc(doc(db, "configs", "levelTypes"));
    const standard = snapshot.exists() ? snapshot.data()?.standard : null;
    if (standard && typeof standard === "object") {
      return {
        1: Number(standard[1] ?? standard["1"] ?? DEFAULT_LEVEL_DAYS[1]),
        2: Number(standard[2] ?? standard["2"] ?? DEFAULT_LEVEL_DAYS[2]),
        3: Number(standard[3] ?? standard["3"] ?? DEFAULT_LEVEL_DAYS[3]),
        4: Number(standard[4] ?? standard["4"] ?? DEFAULT_LEVEL_DAYS[4]),
      };
    }
  } catch (error) {
    console.warn("Could not load level schedule; using defaults.", error);
  }
  return DEFAULT_LEVEL_DAYS;
};

const formatUpdatedLabel = (lastAccessed) => {
  if (!lastAccessed) return "Never opened";

  const accessedAt = new Date(lastAccessed);
  if (Number.isNaN(accessedAt.getTime())) return "Never opened";

  const now = new Date();
  const diffMs = now - accessedAt;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 60 * 1000) return "Just now";
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
};

const getLatestTestedAt = (questions) => {
  const list = Array.isArray(questions)
    ? questions
    : Object.values(questions || {});

  let latest = null;
  list.forEach((question) => {
    if (!question?.lastAnswered) return;
    const stamped = new Date(question.lastAnswered);
    if (Number.isNaN(stamped.getTime())) return;
    if (!latest || stamped > latest) latest = stamped;
  });
  return latest ? latest.toISOString() : null;
};

export const formatLastTestedLabel = (lastTestedAt) => {
  if (!lastTestedAt) return "Never tested";

  const testedAt = new Date(lastTestedAt);
  if (Number.isNaN(testedAt.getTime())) return "Never tested";

  const diffMs = Date.now() - testedAt.getTime();
  if (diffMs < 0) return "Just now";

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

export const wasTestedToday = (lastTestedAt) => {
  if (!lastTestedAt) return false;
  const testedAt = new Date(lastTestedAt);
  if (Number.isNaN(testedAt.getTime())) return false;
  const now = new Date();
  return (
    testedAt.getFullYear() === now.getFullYear() &&
    testedAt.getMonth() === now.getMonth() &&
    testedAt.getDate() === now.getDate()
  );
};

/** Card is due / unanswered if it has no activeTime or activeTime is today or earlier. */
export const isCardDue = (card) => {
  if (!card?.activeTime) return true;
  const activeDate =
    typeof card.activeTime?.toDate === "function"
      ? card.activeTime.toDate()
      : new Date(card.activeTime);
  if (Number.isNaN(activeDate.getTime())) return true;
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return activeDate <= endOfToday;
};

/** Last outcome tag: right | wrong | new */
export const getCardResult = (card) => {
  if (!card?.lastAnswered && !(card?.answerHistory || []).length) {
    return "new";
  }
  if (card.passed) return "right";
  return "wrong";
};

export const RESULT_LABELS = {
  right: "Right",
  wrong: "Wrong",
  new: "New",
};

export const ALL_RESULTS = ["right", "wrong", "new"];

export const filterCardsForTest = (
  cards,
  {
    buckets = [1, 2, 3, 4],
    unansweredOnly = false,
    results = ALL_RESULTS,
  } = {},
) => {
  const bucketSet = new Set(
    (buckets.length ? buckets : [1, 2, 3, 4]).map((value) => Number(value)),
  );
  const resultSet = new Set(
    (results.length ? results : ALL_RESULTS).map((value) => String(value)),
  );

  return (cards || []).filter((card) => {
    const level = Math.min(4, Math.max(1, parseInt(card.level, 10) || 1));
    if (!bucketSet.has(level)) return false;
    if (!resultSet.has(getCardResult(card))) return false;
    if (unansweredOnly && !isCardDue(card)) return false;
    return true;
  });
};

export const shuffleCards = (cards) => {
  const next = [...(cards || [])];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

export const countCardsByBucket = (cards) => {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, due: 0, right: 0, wrong: 0, new: 0 };
  (cards || []).forEach((card) => {
    const level = Math.min(4, Math.max(1, parseInt(card.level, 10) || 1));
    counts[level] += 1;
    if (isCardDue(card)) counts.due += 1;
    counts[getCardResult(card)] += 1;
  });
  return counts;
};

/**
 * Load quizzes from users/{email}/quizCollection (legacy flashcard data).
 */
export const fetchDecksForUser = async (email) => {
  if (!email) return [];

  const quizCollectionRef = collection(db, "users", email, "quizCollection");
  const snapshot = await getDocs(quizCollectionRef);

  const decks = [];
  snapshot.forEach((quizDoc) => {
    const data = quizDoc.data() || {};
    const lastTestedAt = getLatestTestedAt(data.questions);
    decks.push({
      id: quizDoc.id,
      title: data.title || quizDoc.id,
      cards: countQuestions(data.questions),
      updated: formatUpdatedLabel(data.lastAccessed),
      lastAccessed: data.lastAccessed || null,
      lastTestedAt,
      lastTestedLabel: formatLastTestedLabel(lastTestedAt),
      spacedLearning: data.spacedLearning || null,
      raw: data,
    });
  });

  return decks.sort((a, b) => {
    const aTime = a.lastAccessed ? new Date(a.lastAccessed).getTime() : 0;
    const bTime = b.lastAccessed ? new Date(b.lastAccessed).getTime() : 0;
    return bTime - aTime;
  });
};

/**
 * Load one deck and normalize its cards for study mode.
 */
export const fetchDeckById = async (email, deckId) => {
  if (!email || !deckId) return null;

  const quizRef = doc(db, "users", email, "quizCollection", deckId);
  const snapshot = await getDoc(quizRef);
  if (!snapshot.exists()) return null;

  const data = snapshot.data() || {};
  const cards = normalizeQuestions(data.questions);
  const lastTestedAt = getLatestTestedAt(data.questions);

  return {
    id: snapshot.id,
    title: data.title || snapshot.id,
    cards,
    lastAccessed: data.lastAccessed || null,
    lastTestedAt,
    lastTestedLabel: formatLastTestedLabel(lastTestedAt),
    spacedLearning: data.spacedLearning || null,
  };
};

export const touchDeckLastAccessed = async (email, deckId) => {
  if (!email || !deckId) return;
  const quizRef = doc(db, "users", email, "quizCollection", deckId);
  await updateDoc(quizRef, { lastAccessed: new Date().toISOString() });
};

/**
 * Update a card's bucket/level after a test answer.
 * Right → level + 1 (max 4). Wrong → level - 1 (min 1).
 */
export const recordCardAnswer = async (email, deckId, card, choice) => {
  if (!email || !deckId || !card?.id) {
    throw new Error("Missing deck or card information.");
  }

  const schedule = await getLevelSchedule();
  const currentLevel = Math.min(
    4,
    Math.max(1, parseInt(card.level, 10) || 1),
  );
  const passed = choice === "right";
  const level = passed
    ? Math.min(currentLevel + 1, 4)
    : Math.max(currentLevel - 1, 1);
  const days = Number(schedule[level] ?? DEFAULT_LEVEL_DAYS[level] ?? 1);
  const nextActiveDate = new Date();
  nextActiveDate.setDate(nextActiveDate.getDate() + days);
  const lastAnswered = new Date().toISOString();
  const activeTime = nextActiveDate.toISOString();
  const key = String(card.id);
  const historyEntry = {
    at: lastAnswered,
    result: passed ? "right" : "wrong",
    from: currentLevel,
    to: level,
  };
  const answerHistory = [
    ...normalizeAnswerHistory(card.answerHistory),
    historyEntry,
  ].slice(-ANSWER_HISTORY_CAP);

  await updateDoc(doc(db, "users", email, "quizCollection", deckId), {
    [`questions.${key}.passed`]: passed,
    [`questions.${key}.level`]: level,
    [`questions.${key}.lastAnswered`]: lastAnswered,
    [`questions.${key}.activeTime`]: activeTime,
    [`questions.${key}.answerHistory`]: answerHistory,
    lastAccessed: lastAnswered,
  });

  return {
    ...card,
    passed,
    level,
    lastAnswered,
    activeTime,
    answerHistory,
  };
};

export const updateCardText = async (email, deckId, cardId, { question, answer }) => {
  if (!email || !deckId || cardId == null || cardId === "") {
    throw new Error("Missing deck or card information.");
  }

  const key = String(cardId);
  await updateDoc(doc(db, "users", email, "quizCollection", deckId), {
    [`questions.${key}.question`]: String(question ?? ""),
    [`questions.${key}.answer`]: String(answer ?? ""),
    lastAccessed: new Date().toISOString(),
  });
};

export const deleteCardFromDeck = async (email, deckId, cardId) => {
  if (!email || !deckId || cardId == null || cardId === "") {
    throw new Error("Missing deck or card information.");
  }

  const key = String(cardId);
  await updateDoc(doc(db, "users", email, "quizCollection", deckId), {
    [`questions.${key}`]: deleteField(),
    lastAccessed: new Date().toISOString(),
  });
};

const nextQuestionKey = (cards) => {
  const used = new Set((cards || []).map((card) => String(card.id)));
  let next = 0;
  while (used.has(String(next))) next += 1;
  return String(next);
};

const emptyCardFields = (key, question = "", answer = "") => ({
  question,
  answer,
  level: 1,
  passed: false,
  activeTime: null,
  lastAnswered: null,
  answerHistory: [],
  mapIndex: key,
  originalIndex: key,
});

const toLocalCard = (key, question = "", answer = "") => ({
  id: key,
  question,
  answer,
  level: 1,
  passed: false,
  activeTime: null,
  lastAnswered: null,
  answerHistory: [],
});

export const parseBulkQuestions = (text) => {
  const lines = String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");

  let skipped = 0;
  const pairs = [];
  lines.forEach((raw) => {
    const line = raw.trim();
    if (!line) return;
    let question = "";
    let answer = "";
    if (line.includes("\t")) {
      const [first, ...rest] = line.split("\t");
      question = first.trim();
      answer = rest.join("\t").trim();
    } else if (/\s+\|\s+/.test(line)) {
      const parts = line.split(/\s+\|\s+/);
      question = parts[0].trim();
      answer = parts.slice(1).join(" | ").trim();
    } else {
      skipped += 1;
      return;
    }
    if (!question || !answer) {
      skipped += 1;
      return;
    }
    pairs.push({ question, answer });
  });

  return { pairs, skipped };
};

export const addCardToDeck = async (email, deckId, existingCards = []) => {
  if (!email || !deckId) {
    throw new Error("Missing deck information.");
  }
  if (existingCards.length >= MAX_QUESTIONS_PER_DECK) {
    throw new Error(
      `A deck can have at most ${MAX_QUESTIONS_PER_DECK} questions.`,
    );
  }

  const key = nextQuestionKey(existingCards);
  const lastAccessed = new Date().toISOString();
  const card = toLocalCard(key);

  await updateDoc(doc(db, "users", email, "quizCollection", deckId), {
    [`questions.${key}`]: emptyCardFields(key),
    lastAccessed,
  });

  return card;
};

export const addCardsToDeck = async (
  email,
  deckId,
  existingCards = [],
  pairs = [],
) => {
  if (!email || !deckId) {
    throw new Error("Missing deck information.");
  }
  if (!pairs.length) {
    throw new Error("Paste question and answer pairs first.");
  }

  const room = MAX_QUESTIONS_PER_DECK - existingCards.length;
  if (room <= 0) {
    throw new Error(
      `A deck can have at most ${MAX_QUESTIONS_PER_DECK} questions.`,
    );
  }

  const toAdd = pairs.slice(0, room);
  const used = new Set((existingCards || []).map((card) => String(card.id)));
  let next = 0;
  const takeKey = () => {
    while (used.has(String(next))) next += 1;
    const key = String(next);
    used.add(key);
    next += 1;
    return key;
  };

  const lastAccessed = new Date().toISOString();
  const updates = { lastAccessed };
  const cards = toAdd.map((pair) => {
    const key = takeKey();
    updates[`questions.${key}`] = emptyCardFields(
      key,
      pair.question,
      pair.answer,
    );
    return toLocalCard(key, pair.question, pair.answer);
  });

  await updateDoc(doc(db, "users", email, "quizCollection", deckId), updates);

  return {
    cards,
    truncated: pairs.length - toAdd.length,
  };
};

export { assertQuestionLimit, MAX_QUESTIONS_PER_DECK } from "./subscription";

/**
 * Create a new empty deck in the same collection shape as the legacy app.
 */
export const createDeckForUser = async (email, title) => {
  const trimmed = title.trim();
  if (!email || !trimmed) {
    throw new Error("A signed-in user and deck title are required.");
  }

  const [status, existingDecks] = await Promise.all([
    getVerifiedSubscriptionStatus(email),
    fetchDecksForUser(email),
  ]);
  if (!canCreateDeck(status, existingDecks.length)) {
    throw new Error(
      `Free accounts can keep ${FREE_PLAN_MAX_DECKS} decks. Subscribe to add more.`,
    );
  }
  assertQuestionLimit(0);

  const userRef = doc(db, "users", email);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {});
  }

  const quizRef = doc(db, "users", email, "quizCollection", trimmed);
  const existing = await getDoc(quizRef);
  if (existing.exists()) {
    throw new Error("A deck with that name already exists.");
  }

  const lastAccessed = new Date().toISOString();
  await setDoc(quizRef, {
    title: trimmed,
    questions: {},
    lastAccessed,
  });

  return {
    id: trimmed,
    title: trimmed,
    cards: 0,
    updated: "Just now",
    lastAccessed,
    spacedLearning: null,
    raw: { title: trimmed, questions: {}, lastAccessed },
  };
};
