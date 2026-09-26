import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { GRAMMAR } from "../data/grammar.js";
import { usePageMeta } from "../utils/pageMeta.js";

const DESCRIPTION =
  "What is a verb, and what is an adjective. Short answers, a sample deck, and a spaced review schedule.";

export default function GrammarIndexPage() {
  usePageMeta("Grammar questions — Quirkle", DESCRIPTION);

  return (
    <main className="howto">
      <nav className="site-nav">
        <Brand />
        <Link className="text-link" to="/">
          Home
        </Link>
      </nav>

      <article className="howto__sheet">
        <p className="eyebrow">Grammar</p>
        <h1>Grammar questions</h1>
        <p className="howto__lede">
          One question per page. Each answer is short enough to put on a card,
          and the list is where the next grammar question goes.
        </p>

        <ol className="howto-steps">
          {GRAMMAR.map((item) => (
            <li key={item.slug}>
              <span>{item.fieldLabel}</span>
              <strong>
                <Link className="text-link" to={`/grammar/${item.slug}`}>
                  {item.headline}
                </Link>
              </strong>
              <p>{item.lede}</p>
            </li>
          ))}
        </ol>

        <div className="howto__actions">
          <Link className="text-link" to="/computing">
            Computing questions
          </Link>
          <Link className="text-link" to="/">
            Back to Quirkle
          </Link>
        </div>
      </article>
    </main>
  );
}
