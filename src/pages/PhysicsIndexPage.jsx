import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { PHYSICS } from "../data/physics.js";
import { usePageMeta } from "../utils/pageMeta.js";

const DESCRIPTION =
  "What is velocity, the difference between speed and velocity, terminal velocity, and gravity. Short answers, a sample deck, and a spaced review schedule.";

export default function PhysicsIndexPage() {
  usePageMeta("Physics questions — Quirkle", DESCRIPTION);

  return (
    <main className="howto">
      <nav className="site-nav">
        <Brand />
        <Link className="text-link" to="/">
          Home
        </Link>
      </nav>

      <article className="howto__sheet">
        <p className="eyebrow">Physics</p>
        <h1>Physics questions</h1>
        <p className="howto__lede">
          One question per page. Each answer is short enough to put on a card,
          and the list is where the next physics question goes.
        </p>

        <ol className="howto-steps">
          {PHYSICS.map((item) => (
            <li key={item.slug}>
              <span>{item.fieldLabel}</span>
              <strong>
                <Link className="text-link" to={`/physics/${item.slug}`}>
                  {item.headline}
                </Link>
              </strong>
              <p>{item.lede}</p>
            </li>
          ))}
        </ol>

        <div className="howto__actions">
          <Link className="text-link" to="/statistics">
            Statistics questions
          </Link>
          <Link className="text-link" to="/economics">
            Economics questions
          </Link>
          <Link className="text-link" to="/">
            Back to Quirkle
          </Link>
        </div>
      </article>
    </main>
  );
}
