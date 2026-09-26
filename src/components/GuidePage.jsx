import { Link, Navigate, useNavigate } from "react-router-dom";
import Brand from "./Brand.jsx";
import { seedGuestDeck } from "../utils/guestDeck";
import { usePageMeta } from "../utils/pageMeta.js";

export default function GuidePage({
  topic,
  user,
  fallback,
  indexPath,
  indexLabel,
  related = [],
}) {
  const navigate = useNavigate();
  const headline =
    topic?.headline ?? (topic ? `How to study for ${topic.title}` : "");

  usePageMeta(
    topic ? `${headline} — Quirkle` : "Quirkle",
    topic?.description ?? "",
  );

  if (!topic) return <Navigate to={fallback} replace />;

  const studyThisDeck = () => {
    seedGuestDeck({ title: headline, cards: topic.cards });
    navigate("/try");
  };

  return (
    <main className="howto">
      <nav className="site-nav">
        <Brand />
        <Link className="text-link" to="/">
          Home
        </Link>
      </nav>

      <article className="howto__sheet">
        <p className="eyebrow">{topic.fieldLabel}</p>
        <h1>{headline}</h1>
        <p className="howto__lede">{topic.lede}</p>

        <h2>{topic.testsHeading ?? "What this tests"}</h2>
        <p>{topic.tests}</p>

        <h2>Why this fades</h2>
        <p>
          Reading “{headline}” once feels like knowing it. It isn’t. The
          details start leaving as soon as you close the page. A reread walks
          you through the lines you already have and the lines you don’t, in
          the same pass.
        </p>

        <h2>Why a card holds it</h2>
        <p>
          One fact per card. A card you know comes back in 1 day, then 2, then
          4, then 8. Miss it and it returns sooner. You only see what is
          fading. When nothing is due, you stop. {topic.cardRule}
        </p>

        <h2>A sample deck</h2>
        <p>
          These cards are this page, already split. Study them. Sign in with
          Google and the notebook is yours.
        </p>
        <ol className="howto-steps">
          {topic.cards.map((card, index) => (
            <li key={card.question}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{card.question}</strong>
              <p>{card.answer}</p>
            </li>
          ))}
        </ol>

        <div className="howto__actions">
          <button
            className="button button--vermilion"
            onClick={studyThisDeck}
            type="button"
          >
            {user ? "Save this deck" : "Study this deck"}
            <span aria-hidden="true">→</span>
          </button>
          <Link className="text-link" to={indexPath}>
            {indexLabel}
          </Link>
        </div>
        <p>
          {user
            ? "This saves a notebook in your account."
            : "Edit it, run a test, then sign in with Google when you want to keep it."}
        </p>

        <h2>Review schedule</h2>
        <p>{topic.schedule}</p>
        <p>
          <Link className="text-link" to="/spaced-repetition">
            Watch the Leitner buckets
          </Link>
        </p>

        {related.length > 0 && (
          <>
            <h2>Similar guides</h2>
            <ul className="howto-related">
              {related.map((item) => (
                <li key={item.href}>
                  <Link className="text-link" to={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </article>
    </main>
  );
}
