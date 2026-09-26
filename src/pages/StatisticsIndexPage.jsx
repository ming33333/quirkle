import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { STATISTICS } from "../data/statistics.js";
import { usePageMeta } from "../utils/pageMeta.js";

const DESCRIPTION =
  "What is statistics, variance, a p-value, standard deviation, and the mode. Short answers, a sample deck, and a spaced review schedule.";

export default function StatisticsIndexPage() {
  usePageMeta("Statistics questions — Quirkle", DESCRIPTION);

  return (
    <main className="howto">
      <nav className="site-nav">
        <Brand />
        <Link className="text-link" to="/">
          Home
        </Link>
      </nav>

      <article className="howto__sheet">
        <p className="eyebrow">Statistics</p>
        <h1>Statistics questions</h1>
        <p className="howto__lede">
          One question per page. Each answer is short enough to put on a card,
          and the list is where the next statistics question goes.
        </p>

        <ol className="howto-steps">
          {STATISTICS.map((item) => (
            <li key={item.slug}>
              <span>{item.fieldLabel}</span>
              <strong>
                <Link className="text-link" to={`/statistics/${item.slug}`}>
                  {item.headline}
                </Link>
              </strong>
              <p>{item.lede}</p>
            </li>
          ))}
        </ol>

        <div className="howto__actions">
          <Link className="text-link" to="/economics">
            Economics questions
          </Link>
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
