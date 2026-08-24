import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  fetchDeckById,
  getCardResult,
  isCardDue,
  RESULT_LABELS,
  touchDeckLastAccessed,
} from "../utils/decks";
import { buildStudyInsights } from "../utils/studyInsights";
import DueTimeline from "../components/DueTimeline.jsx";

const BUCKETS = [
  { value: "all", label: "All" },
  { value: "1", label: "Bucket 1" },
  { value: "2", label: "Bucket 2" },
  { value: "3", label: "Bucket 3" },
  { value: "4", label: "Bucket 4" },
];

const RESULTS = [
  { value: "all", label: "All" },
  { value: "right", label: "Right" },
  { value: "wrong", label: "Wrong" },
  { value: "new", label: "New" },
];

const DUE_STATES = [
  { value: "all", label: "All" },
  { value: "due", label: "Due now" },
  { value: "resting", label: "Resting" },
];

const lastResultTag = (card) => {
  const tone = getCardResult(card);
  return { label: RESULT_LABELS[tone], tone };
};

function BucketMixBar({ buckets, total }) {
  if (!total) return null;
  return (
    <div className="progress-mix" aria-hidden="true">
      {[1, 2, 3, 4].map((bucket) => {
        const count = buckets[bucket] || 0;
        if (!count) return null;
        return (
          <i
            className={`progress-mix__seg progress-mix__seg--${bucket}`}
            key={bucket}
            style={{ width: `${(count / total) * 100}%` }}
            title={`Bucket ${bucket}: ${count}`}
          />
        );
      })}
    </div>
  );
}

export default function PreviewPage({ user }) {
  const { deckId: encodedDeckId } = useParams();
  const deckId = decodeURIComponent(encodedDeckId || "");
  const navigate = useNavigate();
  const email = user?.email;

  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bucketFilter, setBucketFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const [dueFilter, setDueFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showTags, setShowTags] = useState(true);

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
        touchDeckLastAccessed(email, deckId).catch(() => {});
      } catch (loadError) {
        console.error("Error loading deck preview:", loadError);
        if (!cancelled) setError("Could not open this deck.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDeck();
    return () => {
      cancelled = true;
    };
  }, [deckId, email]);

  const cards = deck?.cards || [];
  const insights = useMemo(() => buildStudyInsights(cards), [cards]);
  const bucketCounts = insights.buckets;

  const resultCounts = useMemo(() => {
    const counts = { right: 0, wrong: 0, new: 0 };
    cards.forEach((card) => {
      counts[getCardResult(card)] += 1;
    });
    return counts;
  }, [cards]);

  const dueCounts = useMemo(
    () => ({
      due: insights.due,
      resting: insights.resting,
    }),
    [insights.due, insights.resting],
  );

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (
        bucketFilter !== "all" &&
        String(parseInt(card.level, 10) || 1) !== bucketFilter
      ) {
        return false;
      }
      if (resultFilter !== "all" && getCardResult(card) !== resultFilter) {
        return false;
      }
      if (dueFilter === "due" && !isCardDue(card)) return false;
      if (dueFilter === "resting" && isCardDue(card)) return false;
      return true;
    });
  }, [bucketFilter, cards, dueFilter, resultFilter]);

  const filtersActive =
    bucketFilter !== "all" || resultFilter !== "all" || dueFilter !== "all";

  const clearFilters = () => {
    setBucketFilter("all");
    setResultFilter("all");
    setDueFilter("all");
  };

  const applyDueFilter = (value) => {
    setDueFilter(value);
    setShowFilters(true);
  };

  if (loading) {
    return (
      <main className="preview">
        <div className="empty-library">
          <p className="empty-library__mark" aria-hidden="true">
            loading
          </p>
          <h2>Opening preview…</h2>
        </div>
      </main>
    );
  }

  if (error || !deck) {
    return (
      <main className="preview">
        <div className="empty-library">
          <h2>{error || "Deck not found."}</h2>
          <Link className="button button--ink" to="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="preview">
      <header className="preview__top">
        <div>
          <p className="eyebrow">Preview</p>
          <h1>{deck.title}</h1>
          <p className="preview__count">
            {filtersActive
              ? `${filteredCards.length} of ${cards.length} cards`
              : `${cards.length} ${cards.length === 1 ? "card" : "cards"}`}
          </p>
        </div>
        <div className="preview__actions">
          <button
            className="text-link text-link--button"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            Back
          </button>
          <button
            className="button button--ink button--small"
            onClick={() => navigate(`/study/${encodeURIComponent(deck.id)}`)}
            type="button"
          >
            Start test
          </button>
        </div>
      </header>

      {cards.length > 0 && (
        <section className="progress-panel" aria-label="Study progress">
          <div className="progress-panel__intro">
            <h2>Progress</h2>
            <p>Snapshot of where this deck stands right now.</p>
          </div>

          <div className="progress-stats">
            <button
              className={`progress-stat${
                dueFilter === "due" ? " progress-stat--active" : ""
              }`}
              onClick={() => applyDueFilter(dueFilter === "due" ? "all" : "due")}
              type="button"
            >
              <strong>{insights.due}</strong>
              <span>Due now</span>
              <em className="progress-stat__tip" role="tooltip">
                Cards ready to study again today.
              </em>
            </button>
            <button
              className={`progress-stat${
                dueFilter === "resting" ? " progress-stat--active" : ""
              }`}
              onClick={() =>
                applyDueFilter(dueFilter === "resting" ? "all" : "resting")
              }
              type="button"
            >
              <strong>{insights.resting}</strong>
              <span>Resting</span>
              <em className="progress-stat__tip" role="tooltip">
                Waiting until their next review day.
              </em>
            </button>
            <div className="progress-stat">
              <strong>{insights.neverTested}</strong>
              <span>Never tested</span>
              <em className="progress-stat__tip" role="tooltip">
                Not answered in a test yet.
              </em>
            </div>
          </div>

          <div className="progress-block">
            <div className="progress-block__head">
              <h3>Bucket mix</h3>
              <p>
                {[1, 2, 3, 4]
                  .map((bucket) => `B${bucket} ${bucketCounts[bucket] || 0}`)
                  .join(" · ")}
              </p>
            </div>
            <BucketMixBar buckets={bucketCounts} total={insights.total} />
          </div>

          <DueTimeline cards={cards} />
        </section>
      )}

      <div className="preview__toolbar">
        <button
          className={`preview__filter-toggle${
            showFilters || filtersActive
              ? " preview__filter-toggle--active"
              : ""
          }`}
          onClick={() => setShowFilters((open) => !open)}
          type="button"
        >
          Filters
          {filtersActive && (
            <span>
              {[
                bucketFilter !== "all" ? `Bucket ${bucketFilter}` : null,
                resultFilter !== "all" ? RESULT_LABELS[resultFilter] : null,
                dueFilter === "due"
                  ? "Due now"
                  : dueFilter === "resting"
                    ? "Resting"
                    : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
          )}
        </button>
        <button
          className={`preview__filter-toggle${
            showTags ? " preview__filter-toggle--active" : ""
          }`}
          onClick={() => setShowTags((visible) => !visible)}
          type="button"
        >
          {showTags ? "Hide tags" : "Show tags"}
        </button>
        {filtersActive && (
          <button
            className="text-link text-link--button"
            onClick={clearFilters}
            type="button"
          >
            Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="preview-filters">
          <div
            className="bucket-filters"
            role="tablist"
            aria-label="Filter by bucket"
          >
            {BUCKETS.map((bucket) => {
              const count =
                bucket.value === "all"
                  ? cards.length
                  : bucketCounts[bucket.value] || 0;
              return (
                <button
                  aria-selected={bucketFilter === bucket.value}
                  className={`bucket-filter${
                    bucketFilter === bucket.value ? " bucket-filter--active" : ""
                  }`}
                  key={bucket.value}
                  onClick={() => setBucketFilter(bucket.value)}
                  type="button"
                >
                  {bucket.label}
                  <span>{count}</span>
                </button>
              );
            })}
          </div>
          <div
            className="bucket-filters"
            role="tablist"
            aria-label="Filter by last result"
          >
            {RESULTS.map((result) => {
              const count =
                result.value === "all"
                  ? cards.length
                  : resultCounts[result.value] || 0;
              return (
                <button
                  aria-selected={resultFilter === result.value}
                  className={`bucket-filter${
                    resultFilter === result.value ? " bucket-filter--active" : ""
                  }`}
                  key={result.value}
                  onClick={() => setResultFilter(result.value)}
                  type="button"
                >
                  {result.label}
                  <span>{count}</span>
                </button>
              );
            })}
          </div>
          <div
            className="bucket-filters"
            role="tablist"
            aria-label="Filter by due date"
          >
            {DUE_STATES.map((state) => {
              const count =
                state.value === "all"
                  ? cards.length
                  : dueCounts[state.value] || 0;
              return (
                <button
                  aria-selected={dueFilter === state.value}
                  className={`bucket-filter${
                    dueFilter === state.value ? " bucket-filter--active" : ""
                  }`}
                  key={state.value}
                  onClick={() => setDueFilter(state.value)}
                  type="button"
                >
                  {state.label}
                  <span>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {cards.length === 0 ? (
        <div className="empty-library">
          <h2>No cards in this deck yet.</h2>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="empty-library">
          <h2>No cards match these filters.</h2>
          <button
            className="button button--paper"
            onClick={clearFilters}
            type="button"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ol className="preview-list">
          {filteredCards.map((card, cardIndex) => {
            const result = lastResultTag(card);
            const due = isCardDue(card);
            return (
              <li className="preview-item" key={card.id || cardIndex}>
                <span className="preview-item__index">
                  {String(cardIndex + 1).padStart(2, "0")}
                </span>
                <div className="preview-item__body">
                  <div>
                    <small>Question</small>
                    <p>{card.question || "No question text"}</p>
                  </div>
                  <div>
                    <small>Answer</small>
                    <p>{card.answer || "No answer text"}</p>
                    {showTags && (
                      <div className="preview-item__meta preview-item__meta--footer">
                        <span className="bucket-pill">Bucket {card.level}</span>
                        <span
                          className={`result-pill result-pill--${result.tone}`}
                        >
                          {result.label}
                        </span>
                        <span
                          className={`due-pill due-pill--${due ? "due" : "resting"}`}
                        >
                          {due ? "Due now" : "Resting"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}
