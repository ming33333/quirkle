import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { usePageMeta } from "../utils/pageMeta.js";

export default function ClusterIndexPage({
  metaTitle,
  description,
  eyebrow,
  title,
  lede,
  items,
  basePath,
  links = [],
}) {
  usePageMeta(metaTitle, description);

  return (
    <main className="howto">
      <nav className="site-nav">
        <Brand />
        <Link className="text-link" to="/">
          Home
        </Link>
      </nav>

      <article className="howto__sheet">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="howto__lede">{lede}</p>

        <ol className="howto-steps">
          {items.map((item) => (
            <li key={item.slug}>
              <span>{item.fieldLabel}</span>
              <strong>
                <Link className="text-link" to={`${basePath}/${item.slug}`}>
                  {item.headline}
                </Link>
              </strong>
              <p>{item.lede}</p>
            </li>
          ))}
        </ol>

        <div className="howto__actions">
          {links.map((link) => (
            <Link className="text-link" key={link.href} to={link.href}>
              {link.label}
            </Link>
          ))}
          <Link className="text-link" to="/">
            Back to Quirkle
          </Link>
        </div>
      </article>
    </main>
  );
}
