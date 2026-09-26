import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { GEMSTONES } from "../data/gemstones.js";
import { usePageMeta } from "../utils/pageMeta.js";

const DESCRIPTION =
  "Blue, green, red, and other gemstones by color. The mineral, the hardness, a sample deck, and a spaced review schedule.";

export default function GemstonesIndexPage() {
  usePageMeta("Gemstones by color — Quirkle", DESCRIPTION);

  return (
    <main className="howto">
      <nav className="site-nav">
        <Brand />
        <Link className="text-link" to="/">
          Home
        </Link>
      </nav>

      <article className="howto__sheet">
        <p className="eyebrow">Gemstones</p>
        <h1>Gemstones by color</h1>
        <p className="howto__lede">
          Pick a color. Each page names the stones, the mineral, and the
          hardness, then gives you a deck so the list does not blur together.
        </p>

        <ol className="howto-steps">
          {GEMSTONES.map((stone) => (
            <li key={stone.slug}>
              <span>{stone.fieldLabel}</span>
              <strong>
                <Link className="text-link" to={`/gemstones/${stone.slug}`}>
                  {stone.headline}
                </Link>
              </strong>
              <p>{stone.lede}</p>
            </li>
          ))}
        </ol>

        <div className="howto__actions">
          <Link className="text-link" to="/star-signs-dates">
            Star signs dates
          </Link>
          <Link className="text-link" to="/">
            Back to Quirkle
          </Link>
        </div>
      </article>
    </main>
  );
}
