import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import {
  ALL_RESULTS,
  fetchDeckById,
  filterCardsForTest,
  recordCardAnswer,
  shuffleCards,
  RESULT_LABELS,
  touchDeckLastAccessed,
} from "../utils/decks";

const parseBuckets = (value) => {
  if (!value) return [1, 2, 3, 4];
  const parsed = value
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((bucket) => bucket >= 1 && bucket <= 4);
  return parsed.length ? [...new Set(parsed)].sort((a, b) => a - b) : [1, 2, 3, 4];
};

const parseResults = (value) => {
  if (!value) return ALL_RESULTS;
  const parsed = value
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter((result) => ALL_RESULTS.includes(result));
  return parsed.length ? ALL_RESULTS.filter((result) => parsed.includes(result)) : ALL_RESULTS;
};

export default function StudyPage({ user }) {
  const { deckId: encodedDeckId } = useParams();
  const deckId = decodeURIComponent(encodedDeckId || "");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = user?.email;

  const buckets = useMemo(
    () => parseBuckets(searchParams.get("buckets")),
    [searchParams],
  );
  const results = useMemo(
    () => parseResults(searchParams.get("results")),
    [searchParams],
  );
  const unansweredOnly = searchParams.get("due") === "1";
  const shuffle = searchParams.get("shuffle") === "1";

  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sessionLastTestedLabel, setSessionLastTestedLabel] = useState("");
  const [queueIds, setQueueIds] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadDeck = async () => {
      if (!email || !deckId) {
        setLoading(false);
        setError("Deck not found.");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const nextDeck = await fetchDeckById(email, deckId);
        if (cancelled) return;
        if (!nextDeck) {
          setError("That deck could not be found.");
          setDeck(null);
          return;
        }
        setDeck(nextDeck);
        setSessionLastTestedLabel(
          nextDeck.lastTestedLabel || "Never tested",
        );
        const filtered = filterCardsForTest(nextDeck.cards, {
          buckets,
          results,
          unansweredOnly,
        });
        const queued = shuffle ? shuffleCards(filtered) : filtered;
        setQueueIds(queued.map((card) => card.id));
        setIndex(0);
        setFlipped(false);
        touchDeckLastAccessed(email, deckId).catch(() => {});
      } catch (loadError) {
        console.error("Error loading deck:", loadError);
        if (!cancelled) setError("Could not open this deck.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDeck();
    return () => {
      cancelled = true;
    };
  }, [buckets, deckId, email, results, shuffle, unansweredOnly]);

  const cards = useMemo(() => {
    if (!deck?.cards) return [];
    if (!queueIds) {
      return filterCardsForTest(deck.cards, {
        buckets,
        results,
        unansweredOnly,
      });
    }
    const byId = new Map(deck.cards.map((card) => [card.id, card]));
    return queueIds.map((id) => byId.get(id)).filter(Boolean);
  }, [buckets, deck, queueIds, results, unansweredOnly]);

  const card = cards[index];
  const progress = cards.length
    ? Math.round(((index + 1) / cards.length) * 100)
    : 0;
  const isLast = index >= cards.length - 1;
  const setupPath = `/preview/${encodeURIComponent(deckId)}`;

  const filterLabel = (() => {
    const parts = [];
    parts.push(
      buckets.length === 4 ? "All buckets" : `Buckets ${buckets.join(", ")}`,
    );
    if (results.length < ALL_RESULTS.length) {
      parts.push(results.map((result) => RESULT_LABELS[result]).join(", "));
    }
    if (unansweredOnly) parts.push("unanswered only");
    if (shuffle) parts.push("shuffled");
    return parts.join(" · ");
  })();

  const goPrev = () => {
    setIndex((current) => Math.max(0, current - 1));
    setFlipped(false);
  };

  const goNext = () => {
    setIndex((current) => Math.min(cards.length - 1, current + 1));
    setFlipped(false);
  };

  const answerCard = async (choice) => {
    if (!email || !deck || !card || saving) return;
    setSaving(true);
    setError("");
    try {
      const updatedCard = await recordCardAnswer(email, deckId, card, choice);
      setDeck((current) => {
        if (!current) return current;
        const nextCards = current.cards.map((item) =>
          item.id === card.id ? updatedCard : item,
        );
        return { ...current, cards: nextCards };
      });
      if (isLast) {
        navigate(`/preview/${encodeURIComponent(deckId)}`);
      } else {
        setIndex((current) => current + 1);
        setFlipped(false);
      }
    } catch (answerError) {
      console.error("Error saving answer:", answerError);
      setError("Could not save that answer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!cards.length || saving) return;
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setFlipped((value) => !value);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
      if (flipped && (event.key === "1" || event.key.toLowerCase() === "r")) {
        event.preventDefault();
        answerCard("right");
      }
      if (flipped && (event.key === "2" || event.key.toLowerCase() === "w")) {
        event.preventDefault();
        answerCard("wrong");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (loading) {
    return (
      <main className="study">
        <div className="empty-library">
          <p className="empty-library__mark" aria-hidden="true">
            loading
          </p>
          <h2>Opening deck…</h2>
        </div>
      </main>
    );
  }

  if (error && !deck) {
    return (
      <main className="study">
        <div className="empty-library">
          <h2>{error || "Deck not found."}</h2>
          <Link className="button button--ink" to="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (!deck || cards.length === 0) {
    return (
      <main className="study">
        <header className="study__top">
          <Brand compact />
          <button
            className="text-link text-link--button"
            onClick={() => navigate(setupPath)}
            type="button"
          >
            Back
          </button>
        </header>
        <div className="empty-library">
          <h2>{deck?.title || "Deck"}</h2>
          <p>
            {deck?.cards?.length
              ? "No cards match your test options."
              : "This deck has no cards yet."}
          </p>
          <Link className="button button--ink" to={setupPath}>
            Change options
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="study">
      <header className="study__top">
        <div>
          <p className="eyebrow">Test mode</p>
          <h1>{deck.title}</h1>
          <p className="study__last-test">
            {sessionLastTestedLabel === "Never tested"
              ? "You haven’t tested these cards yet."
              : `Last tested ${sessionLastTestedLabel.toLowerCase()}.`}
            {" · "}
            {filterLabel}
          </p>
        </div>
        <button
          className="text-link text-link--button"
          onClick={() => navigate(setupPath)}
          type="button"
        >
          Options
        </button>
      </header>

      <div className="study__progress">
        <span>
          Card {index + 1} of {cards.length}
        </span>
        <div className="study__bar" aria-hidden="true">
          <i style={{ width: `${progress}%` }} />
        </div>
        <span>Bucket {card.level}</span>
      </div>

      {error && <p className="dashboard__error">{error}</p>}

      <button
        className={`study-card${flipped ? " study-card--flipped" : ""}`}
        onClick={() => setFlipped((value) => !value)}
        type="button"
      >
        <span className="study-card__face study-card__face--front">
          <small>Question · Bucket {card.level}</small>
          <strong>{card.question || "No question text"}</strong>
          <em>Click to flip</em>
        </span>
        <span className="study-card__face study-card__face--back">
          <small>Answer · Bucket {card.level}</small>
          <strong>{card.answer || "No answer text"}</strong>
          <em>Mark how it went below</em>
        </span>
      </button>

      <div className="study__controls">
        {!flipped ? (
          <>
            <button
              className="button button--paper"
              disabled={index === 0 || saving}
              onClick={goPrev}
              type="button"
            >
              Previous
            </button>
            <button
              className="button button--ink"
              disabled={saving}
              onClick={() => setFlipped(true)}
              type="button"
            >
              Show answer
            </button>
            <button
              className="button button--paper"
              disabled={isLast || saving}
              onClick={goNext}
              type="button"
            >
              Next
            </button>
          </>
        ) : (
          <>
            <button
              className="button button--paper"
              disabled={saving}
              onClick={() => answerCard("wrong")}
              type="button"
            >
              Need review
            </button>
            <button
              className="button button--ink"
              disabled={saving}
              onClick={() => answerCard("right")}
              type="button"
            >
              {saving ? "Saving…" : "Got it right"}
            </button>
          </>
        )}
      </div>

      <p className="study__hint">
        Right moves up a bucket · wrong moves down · Space flips
      </p>
    </main>
  );
}
