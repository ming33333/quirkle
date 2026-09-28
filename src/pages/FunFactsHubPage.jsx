import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { FUN_FACT_GENERAL } from "../data/funFactsGeneral.js";
import { usePageMeta } from "../utils/pageMeta.js";

const SECTIONS = [
  {
    href: "/fun-facts/planets",
    label: "Planets",
    text: "Mercury through Neptune. Eight planets, one page each.",
  },
  {
    href: "/fun-facts/countries",
    label: "Countries",
    text: "The 193 United Nations member states.",
  },
  {
    href: "/fun-facts/country-capitals",
    label: "Country capitals",
    text: "One page for each member state’s capital.",
  },
  {
    href: "/fun-facts/us-state-capitals",
    label: "US state capitals",
    text: "All 50 state capitals.",
  },
  {
    href: "/fun-facts/animals",
    label: "Animals",
    text: "100 well-known animals. Not a scientific ranking.",
  },
];

export default function FunFactsHubPage() {
  usePageMeta(
    "Fun facts — Quirkle",
    "Fun facts about the planets, the 193 UN countries, their capitals, the 50 US state capitals, and 100 animals. A sample deck on each page.",
  );

  return (
    <main className="howto">
      <nav className="site-nav">
        <Brand />
        <Link className="text-link" to="/">
          Home
        </Link>
      </nav>

      <article className="howto__sheet">
        <p className="eyebrow">Fun facts</p>
        <h1>Fun facts</h1>
        <p className="howto__lede">
          Pick a planet, a country, a capital, or an animal. Each page is a
          short deck of facts you can actually review. “Fun facts about” starts
          here.
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
          {FUN_FACT_GENERAL.map((item) => (
            <li key={item.slug}>
              <span>{item.fieldLabel}</span>
              <strong>
                <Link className="text-link" to={`/fun-facts/${item.slug}`}>
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
