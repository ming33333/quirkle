import { useState } from "react";
import { signOut } from "firebase/auth";
import Brand from "../components/Brand.jsx";
import { auth } from "../utils/firebase";

export default function DashboardPage({ user }) {
  const [isCreating, setIsCreating] = useState(false);
  const [deckTitle, setDeckTitle] = useState("");
  const [decks, setDecks] = useState([]);
  const firstName =
    user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "writer";

  const createDeck = (event) => {
    event.preventDefault();
    const title = deckTitle.trim();
    if (!title) return;
    setDecks((current) => [
      ...current,
      { id: Date.now(), title, cards: 0, updated: "Just now" },
    ]);
    setDeckTitle("");
    setIsCreating(false);
  };

  return (
    <main className="dashboard">
      <aside className="dashboard__sidebar">
        <Brand compact />
        <nav>
          <a className="sidebar-link sidebar-link--active" href="#library">
            <span>本</span> Library
          </a>
          <a className="sidebar-link" href="#review">
            <span>復</span> Review
          </a>
        </nav>
        <button
          className="sidebar-signout"
          onClick={() => signOut(auth)}
          type="button"
        >
          Sign out
        </button>
      </aside>

      <section className="dashboard__main">
        <header className="dashboard__header">
          <div>
            <p className="eyebrow">Your study desk</p>
            <h1>Good morning, {firstName}.</h1>
          </div>
          <button
            className="button button--vermilion"
            onClick={() => setIsCreating(true)}
            type="button"
          >
            <span aria-hidden="true">＋</span> New deck
          </button>
        </header>

        <section className="dashboard__summary">
          <article>
            <small>DECKS</small>
            <strong>{decks.length}</strong>
            <span>in your library</span>
          </article>
          <article>
            <small>CARDS</small>
            <strong>0</strong>
            <span>ready to study</span>
          </article>
          <article className="summary-note">
            <span className="summary-note__mark">今日</span>
            <p>Begin with one idea you want your future self to remember.</p>
          </article>
        </section>

        <section className="library" id="library">
          <div className="section-heading">
            <div>
              <p className="eyebrow">My library</p>
              <h2>Flashcard decks</h2>
            </div>
            <span>{decks.length} total</span>
          </div>

          {decks.length === 0 ? (
            <div className="empty-library">
              <div className="empty-library__paper" aria-hidden="true">
                <span>問</span>
                <i />
                <i />
                <i />
              </div>
              <h3>Your first page is blank.</h3>
              <p>
                Create a deck, then turn your notes into questions worth
                returning to.
              </p>
              <button
                className="button button--ink"
                onClick={() => setIsCreating(true)}
                type="button"
              >
                Create your first deck
              </button>
            </div>
          ) : (
            <div className="deck-grid">
              {decks.map((deck) => (
                <article className="deck-card" key={deck.id}>
                  <span className="deck-card__kanji">学</span>
                  <small>{deck.cards} cards</small>
                  <h3>{deck.title}</h3>
                  <p>Updated {deck.updated}</p>
                  <button type="button">Open deck →</button>
                </article>
              ))}
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
            <p className="eyebrow">新しいデッキ</p>
            <h2>Create a new deck</h2>
            <p>Give this collection a simple, memorable name.</p>
            <label>
              Deck name
              <input
                autoFocus
                maxLength={80}
                onChange={(event) => setDeckTitle(event.target.value)}
                placeholder="e.g. Japanese vocabulary"
                value={deckTitle}
              />
            </label>
            <div>
              <button
                className="button button--paper"
                onClick={() => setIsCreating(false)}
                type="button"
              >
                Cancel
              </button>
              <button className="button button--ink" type="submit">
                Create deck
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
