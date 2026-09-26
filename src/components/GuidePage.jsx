import { Link, Navigate } from "react-router-dom";
import Brand from "./Brand.jsx";
import { usePageMeta } from "../utils/pageMeta.js";

export default function GuidePage({
  topic,
  user,
  fallback,
  indexPath,
  indexLabel,
  related = [],
}) {
  const headline =
    topic?.headline ?? (topic ? `How to study for ${topic.title}` : "");

  usePageMeta(
    topic ? `${headline} — Quirkle` : "Quirkle",
    topic?.description ?? "",
  );

  if (!topic) return <Navigate to={fallback} replace />;

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

        <h2>What belongs on a card</h2>
        <p>{topic.cardRule}</p>

        <h2>A sample deck</h2>
        <ol className="howto-steps">
          {topic.cards.map((card, index) => (
            <li key={card.question}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{card.question}</strong>
              <p>{card.answer}</p>
            </li>
          ))}
        </ol>

        <h2>Review schedule</h2>
        <p>{topic.schedule}</p>
        <p>
          <Link className="text-link" to="/spaced-repetition">
            Watch the Leitner buckets
          </Link>
        </p>

        <div className="howto__actions">
          <Link
            className="button button--vermilion"
            to={user ? "/dashboard" : "/try"}
          >
            {user ? "Open your decks" : "Begin writing"}
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="text-link" to={indexPath}>
            {indexLabel}
          </Link>
        </div>

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
