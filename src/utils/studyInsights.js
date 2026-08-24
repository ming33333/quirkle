import { isCardDue } from "./decks";

const dayKey = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const startOfLocalDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getCardDueDate = (card) => {
  const today = startOfLocalDay();
  if (!card?.activeTime) return today;
  const raw =
    typeof card.activeTime?.toDate === "function"
      ? card.activeTime.toDate()
      : new Date(card.activeTime);
  if (Number.isNaN(raw.getTime())) return today;
  const due = startOfLocalDay(raw);
  return due <= today ? today : due;
};

export const countDueByBucketThrough = (cards, throughDate) => {
  const end = startOfLocalDay(throughDate);
  end.setHours(23, 59, 59, 999);
  const buckets = { 1: 0, 2: 0, 3: 0, 4: 0 };
  let total = 0;
  (cards || []).forEach((card) => {
    if (getCardDueDate(card) <= end) {
      const level = Math.min(4, Math.max(1, parseInt(card.level, 10) || 1));
      buckets[level] += 1;
      total += 1;
    }
  });
  return { buckets, total };
};

export const getTimelineSpanDays = (cards, { minDays = 14, maxDays = 90 } = {}) => {
  const today = startOfLocalDay();
  let span = minDays;
  (cards || []).forEach((card) => {
    const due = getCardDueDate(card);
    const offset = Math.ceil((due - today) / 86400000);
    if (offset > span) span = offset;
  });
  return Math.min(Math.max(span, minDays), maxDays);
};

const recentEntries = (history, limit = 10) =>
  (Array.isArray(history) ? history : []).slice(-limit);

const accuracyOf = (entries) => {
  if (!entries.length) return null;
  const rights = entries.filter((entry) => entry.result === "right").length;
  return rights / entries.length;
};

/**
 * Compute snapshot + trend insights for a deck's cards.
 */
export const buildStudyInsights = (cards = [], { days = 14, listLimit = 5 } = {}) => {
  const list = Array.isArray(cards) ? cards : [];
  const buckets = { 1: 0, 2: 0, 3: 0, 4: 0 };
  let due = 0;
  let neverTested = 0;
  let lastRight = 0;
  let lastWrong = 0;
  let historyCount = 0;

  list.forEach((card) => {
    const level = Math.min(4, Math.max(1, parseInt(card.level, 10) || 1));
    buckets[level] += 1;
    if (isCardDue(card)) due += 1;
    if (!card.lastAnswered && !(card.answerHistory || []).length) {
      neverTested += 1;
    }
    if (card.passed) lastRight += 1;
    else if (card.lastAnswered) lastWrong += 1;
    historyCount += (card.answerHistory || []).length;
  });

  const total = list.length;
  const today = startOfLocalDay();
  const daily = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    daily.push({
      key: dayKey(date),
      label: date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      right: 0,
      wrong: 0,
      total: 0,
      accuracy: null,
    });
  }
  const byDay = new Map(daily.map((day) => [day.key, day]));

  list.forEach((card) => {
    (card.answerHistory || []).forEach((entry) => {
      const key = dayKey(entry.at);
      const bucket = byDay.get(key);
      if (!bucket) return;
      bucket.total += 1;
      if (entry.result === "right") bucket.right += 1;
      else bucket.wrong += 1;
    });
  });

  daily.forEach((day) => {
    day.accuracy = day.total ? day.right / day.total : null;
  });

  const recentAll = [];
  list.forEach((card) => {
    (card.answerHistory || []).forEach((entry) => {
      recentAll.push(entry);
    });
  });
  recentAll.sort((a, b) => new Date(a.at) - new Date(b.at));
  const windowEntries = recentAll.slice(-40);
  const recentAccuracy = accuracyOf(windowEntries);

  const scored = list
    .map((card) => {
      const history = card.answerHistory || [];
      const recent = recentEntries(history, 10);
      const wrongs = recent.filter((entry) => entry.result === "wrong").length;
      const rights = recent.filter((entry) => entry.result === "right").length;
      const accuracy = accuracyOf(recent);
      const level = Math.min(4, Math.max(1, parseInt(card.level, 10) || 1));

      let earlyLevel = null;
      let lateLevel = null;
      if (history.length >= 2) {
        earlyLevel = history[0].from;
        lateLevel = history[history.length - 1].to;
      }

      const half = Math.max(1, Math.floor(recent.length / 2));
      const firstHalf = accuracyOf(recent.slice(0, half));
      const secondHalf = accuracyOf(recent.slice(half));
      const accuracyRising =
        firstHalf != null &&
        secondHalf != null &&
        secondHalf - firstHalf >= 0.2 &&
        recent.length >= 4;

      const levelRising =
        earlyLevel != null && lateLevel != null && lateLevel > earlyLevel;

      const struggleScore =
        wrongs * 3 +
        (accuracy == null ? 0 : (1 - accuracy) * 4) +
        (5 - level) * 0.5;

      const improveScore =
        (levelRising ? 4 : 0) +
        (accuracyRising ? 3 : 0) +
        (lateLevel != null ? lateLevel : 0) +
        (rights > wrongs ? 1 : 0);

      return {
        id: card.id,
        question: card.question || "Untitled card",
        level,
        wrongs,
        rights,
        attempts: recent.length,
        accuracy,
        earlyLevel,
        lateLevel,
        struggleScore,
        improveScore,
        levelRising,
        accuracyRising,
      };
    })
    .filter((card) => card.attempts > 0);

  const struggling = [...scored]
    .filter((card) => card.wrongs > 0 || (card.accuracy != null && card.accuracy < 0.6))
    .sort((a, b) => b.struggleScore - a.struggleScore || a.level - b.level)
    .slice(0, listLimit);

  const improving = [...scored]
    .filter((card) => card.levelRising || card.accuracyRising)
    .sort((a, b) => b.improveScore - a.improveScore || b.level - a.level)
    .slice(0, listLimit);

  return {
    total,
    buckets,
    due,
    resting: Math.max(0, total - due),
    neverTested,
    lastRight,
    lastWrong,
    historyCount,
    hasHistory: historyCount > 0,
    recentAccuracy,
    daily,
    struggling,
    improving,
  };
};

export const formatPercent = (ratio) => {
  if (ratio == null || Number.isNaN(ratio)) return "—";
  return `${Math.round(ratio * 100)}%`;
};
