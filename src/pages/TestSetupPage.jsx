import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ALL_RESULTS,
  countCardsByBucket,
  fetchDeckById,
  filterCardsForTest,
  RESULT_LABELS,
  wasTestedToday,
} from "../utils/decks";

const ALL_BUCKETS = [1, 2, 3, 4];

export default function TestSetupPage({ user }) {
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
  const [testedToday, setTestedToday] = useState(false);

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
  }, [deckId, email]);

  const cards = deck?.cards || [];
  const bucketCounts = countCardsByBucket(cards);
  const selectedCards = filterCardsForTest(cards, {
    buckets,
    results,
    unansweredOnly,
  });
  const selectedCount = selectedCards.length;

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

  const selectAllBuckets = () => setBuckets(ALL_BUCKETS);
  const selectAllResults = () => setResults(ALL_RESULTS);

  const startTest = () => {
    if (!selectedCount) return;
    const params = new URLSearchParams();
    params.set("buckets", buckets.join(","));
    params.set("results", results.join(","));
    if (unansweredOnly) params.set("due", "1");
    navigate(
      `/study/${encodeURIComponent(deckId)}/run?${params.toString()}`,
    );
  };

  if (loading) {
    return (
      <main className="study">
        <div className="empty-library">
          <p className="empty-library__mark" aria-hidden="true">
            loading
          </p>
          <h2>Preparing test…</h2>
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

  return (
    <main className="study study--setup">
      <header className="study__top">
        <div>
          <p className="eyebrow">Customize test</p>
          <h1>{deck?.title || "Deck"}</h1>
          <p className="study__last-test">
            {deck?.lastTestedLabel === "Never tested"
              ? "You haven’t tested these cards yet."
              : `Last tested ${String(deck?.lastTestedLabel || "")
                  .toLowerCase()}.`}
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

      {cards.length === 0 ? (
        <div className="empty-library">
          <h2>No cards yet</h2>
          <p>Add cards to this deck before starting a test.</p>
          <Link className="button button--ink" to="/dashboard">
            Back to dashboard
          </Link>
        </div>
      ) : (
        <section className="test-setup">
          <div className="test-setup__block">
            <div className="test-setup__heading">
              <h2>Buckets</h2>
              <button
                className="text-link text-link--button"
                onClick={selectAllBuckets}
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
                const count = bucketCounts[bucket] || 0;
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
                onClick={selectAllResults}
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
                const count = bucketCounts[result] || 0;
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
                  {bucketCounts.due} due in this deck
                </em>
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
    </main>
  );
}
