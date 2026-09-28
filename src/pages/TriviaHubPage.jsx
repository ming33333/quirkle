import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { TRIVIA_TOPICS } from "../data/triviaTopics.js";
import { usePageMeta } from "../utils/pageMeta.js";

const SECTIONS = [
  {
    href: "/trivia/questions",
    label: "Trivia questions",
    text: "A mixed deck. Trivia questions and answers are the same page.",
  },
  {
    href: "/trivia/celebrities",
    label: "Celebrity trivia",
    text: "100 familiar names. Not an official ranking.",
  },
  {
    href: "/trivia/holidays",
    label: "Holiday trivia",
    text: "50 widely celebrated holidays, including Christmas and Halloween.",
  },
  {
    href: "/trivia/movies",
    label: "Movie trivia",
    text: "100 widely known films. Not an official ranking.",
  },
  {
    href: "/trivia/sports",
    label: "Sports trivia",
    text: "A set of widely played sports, from soccer to figure skating.",
  },
];

export default function TriviaHubPage() {
  usePageMeta(
    "Trivia — Quirkle",
    "Trivia questions, celebrity trivia, holiday trivia, movie trivia, and sports trivia. A sample deck on each page.",
  );

  const rest = TRIVIA_TOPICS.filter((item) => item.slug !== "questions");

  return (
    <main className="howto">
      <nav className="site-nav">
        <Brand />
        <Link className="text-link" to="/">
          Home
        </Link>
      </nav>

      <article className="howto__sheet">
        <p className="eyebrow">Trivia</p>
        <h1>Trivia</h1>
        <p className="howto__lede">
          A trivia question is one fact with a short answer. Pick a set. Each
          page is a sample deck you can study on a schedule.
        </p>

        <ol className="howto-steps">
          {SECTIONS.map((section) => (
            <li key={section.href}>
              <span>Section</span>
              <strong>
                <Link className="text-link" to={section.href}>
                  {section.label}
                </Link>
              </strong>
              <p>{section.text}</p>
            </li>
          ))}
          {rest.map((item) => (
            <li key={item.slug}>
              <span>{item.fieldLabel}</span>
              <strong>
                <Link className="text-link" to={`/trivia/${item.slug}`}>
                  {item.headline}
                </Link>
              </strong>
              <p>{item.lede}</p>
            </li>
          ))}
        </ol>

        <div className="howto__actions">
          <Link className="text-link" to="/how-to-study">
            Study guides
          </Link>
          <Link className="text-link" to="/">
            Back to Quirkle
          </Link>
        </div>
      </article>
    </main>
  );
}
