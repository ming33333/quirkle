import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { STUDY_TOPICS } from "../data/studyTopics.js";
import { usePageMeta } from "../utils/pageMeta.js";

const DESCRIPTION =
  "How to study for medical school, internal medicine, and FAR leases. What to put on flashcards, a sample deck, and a spaced review schedule.";

export default function StudyTopicsIndexPage() {
  usePageMeta("How to study — Quirkle", DESCRIPTION);

  return (
    <main className="howto">
      <nav className="site-nav">
        <Brand />
        <Link className="text-link" to="/">
          Home
        </Link>
      </nav>

      <article className="howto__sheet">
        <p className="eyebrow">How to study</p>
        <h1>How to study</h1>
        <p className="howto__lede">
          Pick a subject. Each page says what to put on cards, gives you a
          sample deck, and sets the review schedule.
        </p>

        <ol className="howto-steps">
          {STUDY_TOPICS.map((topic) => (
            <li key={topic.slug}>
              <span>{topic.fieldLabel}</span>
              <strong>
                <Link
                  className="text-link"
                  to={`/how-to-study/${topic.slug}`}
                >
                  How to study for {topic.title}
                </Link>
              </strong>
              <p>{topic.lede}</p>
            </li>
          ))}
        </ol>

        <div className="howto__actions">
          <Link className="text-link" to="/how-to-learn">
            Learn a language
          </Link>
          <Link className="text-link" to="/">
            Back to Quirkle
          </Link>
        </div>
      </article>
    </main>
  );
}
