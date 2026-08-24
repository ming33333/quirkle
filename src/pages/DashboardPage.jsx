import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import Brand from "../components/Brand.jsx";
import { auth } from "../utils/firebase";
import { createDeckForUser, fetchDecksForUser } from "../utils/decks";
import {
  canCreateDeck,
  FREE_PLAN_MAX_DECKS,
  getSubscriptionStatus,
} from "../utils/subscription";

export default function DashboardPage({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreating, setIsCreating] = useState(false);
  const [deckTitle, setDeckTitle] = useState("");
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [activeDeckId, setActiveDeckId] = useState(null);
  const [planStatus, setPlanStatus] = useState("free");
  const firstName =
    user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "writer";
  const email = user?.email;

  useEffect(() => {
    let cancelled = false;

    const loadDecks = async () => {
      if (!email) {
        setDecks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const [nextDecks, status] = await Promise.all([
          fetchDecksForUser(email),
          getSubscriptionStatus(email),
        ]);
        if (!cancelled) {
          setDecks(nextDecks);
          setPlanStatus(status);
        }
      } catch (loadError) {
        console.error("Error loading decks:", loadError);
        if (!cancelled) {
          setError("Could not load your flashcards. Please try again.");
          setDecks([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDecks();
    return () => {
      cancelled = true;
    };
  }, [email]);

  const createDeck = async (event) => {
    event.preventDefault();
    const title = deckTitle.trim();
    if (!title || !email || creating) return;
    if (!canCreateDeck(planStatus, decks.length)) {
      setError(
        `Free accounts can keep ${FREE_PLAN_MAX_DECKS} decks. Subscribe to add more.`,
      );
      return;
    }

    setCreating(true);
    setError("");
    try {
      const deck = await createDeckForUser(email, title);
      setDecks((current) => [deck, ...current]);
      setDeckTitle("");
      setIsCreating(false);
    } catch (createError) {
      console.error("Error creating deck:", createError);
      setError(createError.message || "Could not create that deck.");
    } finally {
      setCreating(false);
    }
  };

  const atDeckLimit = !canCreateDeck(planStatus, decks.length);

  const openCreate = () => {
    if (atDeckLimit) {
      setError(
        `Free accounts can keep ${FREE_PLAN_MAX_DECKS} decks. Subscribe to add more.`,
      );
      return;
    }
    setError("");
    setIsCreating(true);
  };

  return (
    <main className="dashboard">
      <header className="dashboard__top">
        <Brand />
        <div className="dashboard__top-actions">
          <Link className="text-link" to="/">
            Home
          </Link>
          <Link className="text-link" to="/profile" state={{ background: location }}>
            Profile
          </Link>
          <button
            className="text-link text-link--button"
            onClick={() => signOut(auth)}
            type="button"
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="dashboard__main">
        <header className="dashboard__header">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1>Hello, {firstName}.</h1>
          </div>
          <button
            className="button button--ink"
            onClick={openCreate}
            type="button"
          >
            New deck
          </button>
        </header>

        {error && !isCreating && (
          <p className="dashboard__error">
            {error}{" "}
            {atDeckLimit && (
              <Link className="text-link" to="/profile" state={{ background: location }}>
                Open profile
              </Link>
            )}
          </p>
        )}

        <section className="library" aria-label="Your decks">
          {loading ? (
            <div className="empty-library">
              <p className="empty-library__mark" aria-hidden="true">
                loading
              </p>
              <h2>Opening your notebooks…</h2>
            </div>
          ) : decks.length === 0 ? (
            <div className="empty-library">
              <p className="empty-library__mark" aria-hidden="true">
                blank
              </p>
              <h2>Nothing here yet.</h2>
              <p>Create a deck when you’re ready to begin.</p>
              <button
                className="button button--vermilion"
                onClick={openCreate}
                type="button"
              >
                Create a deck
              </button>
            </div>
          ) : (
            <div className="deck-grid">
              {decks.map((deck) => {
                const isActive = activeDeckId === deck.id;
                const encodedId = encodeURIComponent(deck.id);

                return (
                  <div
                    className={`deck-card${isActive ? " deck-card--active" : ""}`}
                    key={deck.id}
                  >
                    {isActive ? (
                      <>
                        <strong className="deck-card__title">{deck.title}</strong>
                        <p className="deck-card__last-test">
                          Last test: {deck.lastTestedLabel || "Never tested"}
                        </p>
                        <div className="deck-card__modes">
                          <button
                            onClick={() => navigate(`/preview/${encodedId}`)}
                            type="button"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => navigate(`/study/${encodedId}`)}
                            type="button"
                          >
                            Test
                          </button>
                        </div>
                        <button
                          className="deck-card__cancel"
                          onClick={() => setActiveDeckId(null)}
                          type="button"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="deck-card__hit"
                        onClick={() => setActiveDeckId(deck.id)}
                        type="button"
                      >
                        <span className="deck-card__meta">
                          {deck.cards} {deck.cards === 1 ? "card" : "cards"} ·{" "}
                          {deck.updated}
                        </span>
                        <strong className="deck-card__title">{deck.title}</strong>
                        <span className="deck-card__action">Open</span>
                      </button>
                    )}
                  </div>
                );
              })}
              <button
                className="deck-card deck-card--add"
                onClick={openCreate}
                type="button"
              >
                <span className="deck-card__plus" aria-hidden="true">
                  +
                </span>
                <strong>New deck</strong>
              </button>
            </div>
          )}
        </section>
      </section>

      {isCreating && (
        <div
          className="dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsCreating(false);
          }}
        >
          <form className="new-deck-dialog" onSubmit={createDeck}>
            <p className="eyebrow">New deck</p>
            <h2>Name this deck</h2>
            <label>
              Title
              <input
                autoFocus
                maxLength={80}
                onChange={(event) => setDeckTitle(event.target.value)}
                placeholder="e.g. Japanese vocabulary"
                value={deckTitle}
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <div>
              <button
                className="button button--paper"
                onClick={() => {
                  setIsCreating(false);
                  setError("");
                }}
                type="button"
              >
                Cancel
              </button>
              <button
                className="button button--ink"
                disabled={creating}
                type="submit"
              >
                {creating ? "Creating…" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
