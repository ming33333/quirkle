import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import {
  MAX_QUESTIONS_PER_DECK,
  freePlanDeckLabel,
} from "../utils/subscription";

const STEPS = [
  {
    n: "01",
    title: "Make a deck",
    body: "Name a notebook. One subject per deck keeps reviews small.",
  },
  {
    n: "02",
    title: "Write the cards",
    body: `Type them one at a time, or paste two columns from a spreadsheet — question, then answer, one pair per line. A deck holds up to ${MAX_QUESTIONS_PER_DECK} cards: the size of a notebook, not a dump of everything.`,
  },
  {
    n: "03",
    title: "Study what’s due",
    body: "You only see cards that are fading. Right sends a card further out. Wrong brings it back sooner.",
  },
  {
    n: "04",
    title: "That’s the day",
    body: "When nothing’s due, you’re done. Come back tomorrow.",
  },
];

export default function HowToPage({ user }) {
  return (
    <main className="howto">
      <nav className="site-nav">
        <Brand />
        <Link className="text-link" to="/">
          Home
        </Link>
      </nav>

      <article className="howto__sheet">
        <p className="eyebrow">How to</p>
        <h1>How to use Quirkle</h1>
        <p className="howto__lede">
          Write a deck. Study what’s due. Close the notebook.
        </p>

        <ol className="howto-steps">
          {STEPS.map((step) => (
            <li key={step.n}>
              <span>{step.n}</span>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>

        <p>
          Free accounts can keep {freePlanDeckLabel}. Subscribe if you need more
          notebooks.{" "}
          <Link className="text-link" to="/spaced-repetition">
            Watch how the buckets work
          </Link>
          .
        </p>

        <div className="howto__actions">
          <Link
            className="button button--vermilion"
            to={user ? "/dashboard" : "/login"}
          >
            {user ? "Open your decks" : "Begin writing"}
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="text-link" to="/">
            Back to Quirkle
          </Link>
        </div>
      </article>
    </main>
  );
}
