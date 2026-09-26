import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { BUSINESS } from "../data/business.js";
import { usePageMeta } from "../utils/pageMeta.js";

const DESCRIPTION =
  "What is an LLC, an S corp, an IPO, and an index fund. Short answers, a sample deck, and a spaced review schedule.";

export default function BusinessIndexPage() {
  usePageMeta("Business questions — Quirkle", DESCRIPTION);

  return (
    <main className="howto">
      <nav className="site-nav">
        <Brand />
        <Link className="text-link" to="/">
          Home
        </Link>
      </nav>

      <article className="howto__sheet">
        <p className="eyebrow">Business</p>
        <h1>Business questions</h1>
        <p className="howto__lede">
          One question per page. Each answer is short enough to put on a card,
          and the list is where the next business question goes.
        </p>

        <ol className="howto-steps">
          {BUSINESS.map((item) => (
            <li key={item.slug}>
              <span>{item.fieldLabel}</span>
              <strong>
                <Link className="text-link" to={`/business/${item.slug}`}>
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
          <Link className="text-link" to="/grammar">
            Grammar questions
          </Link>
          <Link className="text-link" to="/">
            Back to Quirkle
          </Link>
        </div>
      </article>
    </main>
  );
}
