import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { COMPUTING } from "../data/computing.js";
import { usePageMeta } from "../utils/pageMeta.js";

const DESCRIPTION =
  "What is artificial intelligence, an API, and artificial general intelligence. Short answers, a sample deck, and a spaced review schedule.";

export default function ComputingIndexPage() {
  usePageMeta("Computing questions — Quirkle", DESCRIPTION);

  return (
    <main className="howto">
      <nav className="site-nav">
        <Brand />
        <Link className="text-link" to="/">
          Home
        </Link>
      </nav>

      <article className="howto__sheet">
        <p className="eyebrow">Computing</p>
        <h1>Computing questions</h1>
        <p className="howto__lede">
          One question per page. Each answer is short enough to put on a card,
          and the list is where the next computing question goes.
        </p>

        <ol className="howto-steps">
          {COMPUTING.map((item) => (
            <li key={item.slug}>
              <span>{item.fieldLabel}</span>
              <strong>
                <Link className="text-link" to={`/computing/${item.slug}`}>
                  {item.headline}
                </Link>
              </strong>
              <p>{item.lede}</p>
            </li>
          ))}
        </ol>

        <div className="howto__actions">
          <Link className="text-link" to="/how-to-learn/ai">
            How to learn AI
          </Link>
          <Link className="text-link" to="/physics">
            Physics questions
          </Link>
          <Link className="text-link" to="/">
            Back to Quirkle
          </Link>
        </div>
      </article>
    </main>
  );
}
