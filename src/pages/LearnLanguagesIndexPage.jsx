import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { LANGUAGES } from "../data/languages.js";
import { usePageMeta } from "../utils/pageMeta.js";

const DESCRIPTION =
  "How to learn Spanish, French, Japanese, Chinese, and other languages fast with flashcards. A sample deck and a spaced review schedule for each.";

export default function LearnLanguagesIndexPage() {
  usePageMeta("How to learn a language fast — Quirkle", DESCRIPTION);

  return (
    <main className="howto">
      <nav className="site-nav">
        <Brand />
        <Link className="text-link" to="/">
          Home
        </Link>
      </nav>

      <article className="howto__sheet">
        <p className="eyebrow">Languages</p>
        <h1>How to learn a language fast</h1>
        <p className="howto__lede">
          Pick a language. Each page is the words and phrases to put on cards,
          a sample deck, and a review schedule. Speaking comes from using them.
          The cards keep them from slipping.
        </p>

        <ol className="howto-steps">
          {LANGUAGES.map((language) => (
            <li key={language.slug}>
              <span>{language.fieldLabel}</span>
              <strong>
                <Link className="text-link" to={`/how-to-learn/${language.slug}`}>
                  {language.headline}
                </Link>
              </strong>
              <p>{language.lede}</p>
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
