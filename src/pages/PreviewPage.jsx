import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  addCardToDeck,
  addCardsToDeck,
  ALL_RESULTS,
  countCardsByBucket,
  fetchDeckById,
  filterCardsForTest,
  getCardResult,
  isCardDue,
  MAX_QUESTIONS_PER_DECK,
  parseBulkQuestions,
  RESULT_LABELS,
  touchDeckLastAccessed,
  wasTestedToday,
} from "../utils/decks";
import { buildStudyInsights } from "../utils/studyInsights";
import DueTimeline from "../components/DueTimeline.jsx";
import PreviewCard from "../components/PreviewCard.jsx";

const ALL_BUCKETS = [1, 2, 3, 4];

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

const PASTE_EXAMPLE = [
  {
    question: "When is National Donut Day?",
    answer: "The first Friday in June.",
  },
  {
    question: "How long is a marathon?",
    answer: "26.2 miles.",
  },
  {
    question: "What’s heavier, a pound of feathers or a pound of rocks?",
    answer: "They weigh the same.",
  },
];

const PASTE_EXAMPLE_TEXT = PASTE_EXAMPLE.map(
  (row) => `${row.question}\t${row.answer}`,
).join("\n");

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
  const [buckets, setBuckets] = useState(ALL_BUCKETS);
  const [results, setResults] = useState(ALL_RESULTS);
  const [unansweredOnly, setUnansweredOnly] = useState(false);
  const [shuffleCards, setShuffleCards] = useState(true);
  const [testedToday, setTestedToday] = useState(false);
  const [bucketFilter, setBucketFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const [dueFilter, setDueFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showTags, setShowTags] = useState(true);
  const [addingCard, setAddingCard] = useState(false);
  const [addError, setAddError] = useState("");
  const [focusedCardId, setFocusedCardId] = useState("");
  const [showBulkPaste, setShowBulkPaste] = useState(false);
  const [bulkInput, setBulkInput] = useState("");
  const [addingBulk, setAddingBulk] = useState(false);
  const [exampleCopied, setExampleCopied] = useState(false);

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
        const alreadyToday = wasTestedToday(nextDeck.lastTestedAt);
        setTestedToday(alreadyToday);
        setUnansweredOnly(alreadyToday);
        setBuckets(ALL_BUCKETS);
        setResults(ALL_RESULTS);
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

  useEffect(() => {
    if (!exampleCopied) return undefined;
    const hide = setTimeout(() => setExampleCopied(false), 1600);
    return () => clearTimeout(hide);
  }, [exampleCopied]);

  const cards = deck?.cards || [];
  const insights = useMemo(() => buildStudyInsights(cards), [cards]);
  const bucketCounts = insights.buckets;
  const setupCounts = useMemo(() => countCardsByBucket(cards), [cards]);
  const selectedCards = useMemo(
    () =>
      filterCardsForTest(cards, {
        buckets,
        results,
        unansweredOnly,
      }),
    [buckets, cards, results, unansweredOnly],
  );
  const selectedCount = selectedCards.length;

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

  const toggleBucket = (bucket) => {
    setBuckets((current) => {
      if (current.includes(bucket)) {
        if (current.length === 1) return current;
        return current.filter((value) => value !== bucket);
      }
      return [...current, bucket].sort((a, b) => a - b);
    });
  };

  const toggleResult = (result) => {
    setResults((current) => {
      if (current.includes(result)) {
        if (current.length === 1) return current;
        return current.filter((value) => value !== result);
      }
      return ALL_RESULTS.filter(
        (value) => current.includes(value) || value === result,
      );
    });
  };

  const startTest = () => {
    if (!selectedCount) return;
    const params = new URLSearchParams();
    params.set("buckets", buckets.join(","));
    params.set("results", results.join(","));
    if (unansweredOnly) params.set("due", "1");
    if (shuffleCards) params.set("shuffle", "1");
    navigate(`/study/${encodeURIComponent(deckId)}/run?${params.toString()}`);
  };

  const handleCardTextUpdate = useCallback((cardId, { question, answer }) => {
    setDeck((current) => {
      if (!current) return current;
      return {
        ...current,
        cards: current.cards.map((card) =>
          card.id === cardId ? { ...card, question, answer } : card,
        ),
      };
    });
  }, []);

  const handleCardDelete = useCallback((cardId) => {
    setDeck((current) => {
      if (!current) return current;
      return {
        ...current,
        cards: current.cards.filter((card) => card.id !== cardId),
      };
    });
    setFocusedCardId((current) => (current === cardId ? "" : current));
  }, []);

  const atQuestionLimit = cards.length >= MAX_QUESTIONS_PER_DECK;
  const bulkPreview = useMemo(() => parseBulkQuestions(bulkInput), [bulkInput]);
  const bulkRoom = Math.max(0, MAX_QUESTIONS_PER_DECK - cards.length);
  const bulkWillAdd = Math.min(bulkPreview.pairs.length, bulkRoom);
  const bulkWillSkipLimit = bulkPreview.pairs.length - bulkWillAdd;

  const addQuestion = async () => {
    if (!email || !deckId || addingCard || atQuestionLimit) return;
    setAddingCard(true);
    setAddError("");
    try {
      const card = await addCardToDeck(email, deckId, cards);
      setDeck((current) => {
        if (!current) return current;
        return { ...current, cards: [...current.cards, card] };
      });
      setBucketFilter("all");
      setResultFilter("all");
      setDueFilter("all");
      setFocusedCardId(card.id);
    } catch (addCardError) {
      console.error("Error adding card:", addCardError);
      setAddError(addCardError.message || "Could not add that question.");
    } finally {
      setAddingCard(false);
    }
  };

  const closeBulkPaste = () => {
    setShowBulkPaste(false);
    setExampleCopied(false);
    setBulkInput("");
    setAddError("");
  };

  const copyPasteExample = async () => {
    try {
      await navigator.clipboard.writeText(PASTE_EXAMPLE_TEXT);
    } catch {
      const field = document.createElement("textarea");
      field.value = PASTE_EXAMPLE_TEXT;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      document.body.removeChild(field);
    }
    setExampleCopied(true);
  };

  const addBulkQuestions = async () => {
    if (!email || !deckId || addingBulk || atQuestionLimit) return;
    const { pairs } = parseBulkQuestions(bulkInput);
    if (!pairs.length) {
      setAddError(
        "Paste one pair per line: question, then a tab, then the answer.",
      );
      return;
    }
    setAddingBulk(true);
    setAddError("");
    try {
      const { cards: added, truncated } = await addCardsToDeck(
        email,
        deckId,
        cards,
        pairs,
      );
      setDeck((current) => {
        if (!current) return current;
        return { ...current, cards: [...current.cards, ...added] };
      });
      setBucketFilter("all");
      setResultFilter("all");
      setDueFilter("all");
      setFocusedCardId(added[added.length - 1]?.id || "");
      setShowBulkPaste(false);
      setBulkInput("");
      if (truncated) {
        setAddError(
          `Added ${added.length}. ${truncated} more would go over the ${MAX_QUESTIONS_PER_DECK} question limit.`,
        );
      }
    } catch (addCardError) {
      console.error("Error adding questions:", addCardError);
      setAddError(addCardError.message || "Could not add those questions.");
    } finally {
      setAddingBulk(false);
    }
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
          <p className="eyebrow">Deck</p>
          <h1>{deck.title}</h1>
          <p className="preview__count">
            {filtersActive
              ? `${filteredCards.length} of ${cards.length} cards`
              : `${cards.length} ${cards.length === 1 ? "card" : "cards"}`}
          </p>
          <p className="study__last-test">
            {deck.lastTestedLabel === "Never tested"
              ? "You haven’t tested these cards yet."
              : `Last tested ${String(deck.lastTestedLabel || "").toLowerCase()}.`}
            {testedToday
              ? " You’ve already tested today — unanswered cards are selected by default."
              : ""}
          </p>
        </div>
        <button
          className="text-link text-link--button"
          onClick={() => navigate("/dashboard")}
          type="button"
        >
          Back
        </button>
      </header>

      {cards.length > 0 && (
        <section className="test-setup" aria-label="Start test">
          <div className="test-setup__block">
            <div className="test-setup__heading">
              <h2>Buckets</h2>
              <button
                className="text-link text-link--button"
                onClick={() => setBuckets(ALL_BUCKETS)}
                type="button"
              >
                All
              </button>
            </div>
            <p className="test-setup__hint">
              Include only the buckets you want to practice.
            </p>
            <div className="test-setup__buckets" role="group" aria-label="Buckets">
              {ALL_BUCKETS.map((bucket) => {
                const active = buckets.includes(bucket);
                const count = setupCounts[bucket] || 0;
                return (
                  <button
                    key={bucket}
                    aria-pressed={active}
                    className={`test-setup__bucket${
                      active ? " test-setup__bucket--active" : ""
                    }`}
                    onClick={() => toggleBucket(bucket)}
                    type="button"
                  >
                    <strong>Bucket {bucket}</strong>
                    <span>
                      {count} {count === 1 ? "card" : "cards"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="test-setup__block">
            <div className="test-setup__heading">
              <h2>Last result</h2>
              <button
                className="text-link text-link--button"
                onClick={() => setResults(ALL_RESULTS)}
                type="button"
              >
                All
              </button>
            </div>
            <p className="test-setup__hint">
              Filter by how the card went last time.
            </p>
            <div
              className="test-setup__buckets test-setup__buckets--results"
              role="group"
              aria-label="Last result"
            >
              {ALL_RESULTS.map((result) => {
                const active = results.includes(result);
                const count = setupCounts[result] || 0;
                return (
                  <button
                    key={result}
                    aria-pressed={active}
                    className={`test-setup__bucket${
                      active ? " test-setup__bucket--active" : ""
                    }`}
                    onClick={() => toggleResult(result)}
                    type="button"
                  >
                    <strong>{RESULT_LABELS[result]}</strong>
                    <span>
                      {count} {count === 1 ? "card" : "cards"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="test-setup__block">
            <h2>Scope</h2>
            <label className="test-setup__check">
              <input
                checked={unansweredOnly}
                onChange={(event) => setUnansweredOnly(event.target.checked)}
                type="checkbox"
              />
              <span>
                <strong>Only unanswered questions</strong>
                <em>
                  Cards that are due now
                  {testedToday ? " (recommended after today’s test)" : ""}
                  {" · "}
                  {setupCounts.due} due in this deck
                </em>
              </span>
            </label>
            <label className="test-setup__check">
              <input
                checked={shuffleCards}
                onChange={(event) => setShuffleCards(event.target.checked)}
                type="checkbox"
              />
              <span>
                <strong>Shuffle card order</strong>
                <em>Mix the queue so this test is not in the same order as last time.</em>
              </span>
            </label>
          </div>

          <div className="test-setup__summary">
            <p>
              {selectedCount === 0
                ? "No cards match these options."
                : `${selectedCount} ${
                    selectedCount === 1 ? "card" : "cards"
                  } ready to test`}
            </p>
            <button
              className="button button--ink"
              disabled={selectedCount === 0}
              onClick={startTest}
              type="button"
            >
              Start test
            </button>
          </div>
        </section>
      )}

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
        <div className="preview__toolbar-start">
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
        <div className="preview__toolbar-end">
          <button
            className={`preview__filter-toggle${
              showBulkPaste ? " preview__filter-toggle--active" : ""
            }`}
            disabled={atQuestionLimit}
            onClick={() => {
              setAddError("");
              setShowBulkPaste((open) => !open);
            }}
            type="button"
          >
            Paste questions
          </button>
          <button
            className="preview__add"
            disabled={addingCard || atQuestionLimit}
            onClick={addQuestion}
            type="button"
          >
            {addingCard ? "Adding…" : "Add question"}
          </button>
        </div>
      </div>
      {showBulkPaste && (
        <div className="preview-bulk">
          <div className="preview-bulk__head">
            <h3>Paste questions</h3>
            <button
              className="text-link text-link--button"
              onClick={closeBulkPaste}
              type="button"
            >
              Close
            </button>
          </div>
          <p>
            Copy two columns from a spreadsheet (question, then answer). One
            pair per line, tab-separated — the same as before.
          </p>
          <div className="preview-bulk__example">
            <div className="preview-bulk__example-head">
              <small>Example</small>
              <button
                className="button button--paper button--small"
                onClick={copyPasteExample}
                type="button"
              >
                {exampleCopied ? "Copied" : "Copy here"}
              </button>
            </div>
            <textarea
              aria-label="Example questions to copy"
              className="preview-bulk__example-copy"
              onFocus={(event) => event.currentTarget.select()}
              readOnly
              rows={3}
              value={PASTE_EXAMPLE_TEXT}
            />
          </div>
          <textarea
            aria-label="Bulk questions"
            onChange={(event) => setBulkInput(event.target.value)}
            placeholder={"When is National Donut Day?\tThe first Friday in June.\nHow long is a marathon?\t26.2 miles."}
            rows={7}
            value={bulkInput}
          />
          <div className="preview-bulk__actions">
            <p>
              {bulkPreview.pairs.length
                ? `${bulkWillAdd} ${bulkWillAdd === 1 ? "question" : "questions"} ready`
                : "No pairs yet"}
              {bulkPreview.skipped
                ? ` · ${bulkPreview.skipped} ${
                    bulkPreview.skipped === 1 ? "line" : "lines"
                  } skipped`
                : ""}
              {bulkWillSkipLimit
                ? ` · ${bulkWillSkipLimit} over the deck limit`
                : ""}
            </p>
            <button
              className="button button--ink button--small"
              disabled={addingBulk || !bulkWillAdd}
              onClick={addBulkQuestions}
              type="button"
            >
              {addingBulk
                ? "Adding…"
                : `Add ${bulkWillAdd} ${
                    bulkWillAdd === 1 ? "question" : "questions"
                  }`}
            </button>
          </div>
        </div>
      )}

      {addError || atQuestionLimit ? (
        <p className="preview__toolbar-note">
          {addError ||
            `This deck already has ${MAX_QUESTIONS_PER_DECK} questions.`}
        </p>
      ) : null}

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
          <p>Use Add question to create the first card.</p>
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
        <>
          <p className="preview-list__hint">
            Click a question or answer to edit. Changes save automatically.
            Delete removes a card from this deck.
          </p>
          <ol className="preview-list">
            {filteredCards.map((card, cardIndex) => (
              <PreviewCard
                autoFocus={card.id === focusedCardId}
                card={card}
                deckId={deckId}
                email={email}
                index={cardIndex}
                key={card.id || cardIndex}
                onDelete={handleCardDelete}
                onUpdate={handleCardTextUpdate}
                showTags={showTags}
              />
            ))}
          </ol>
        </>
      )}
    </main>
  );
}
