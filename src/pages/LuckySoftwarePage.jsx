import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";

export default function LuckySoftwarePage() {
  return (
    <main className="lucky">
      <nav className="site-nav">
        <Brand />
        <Link className="text-link" to="/">
          Home
        </Link>
      </nav>

      <article className="lucky__sheet">
        <p className="eyebrow">About</p>
        <h1>Lucky Software</h1>
        <p className="lucky__lede">
          Lucky Software is a one-person shop. I build the study tools I
          wished existed when I was trying to learn something and kept getting
          pulled sideways.
        </p>
        <p>
          I looked for a quiet place to write flashcards and actually review
          them — spaced, simple, without a feed, a streak leaderboard, or a
          dozen buttons competing for attention. I couldn’t find one that
          stayed out of the way, so I made Quirkle.
        </p>
        <p>
          Quirkle is dedicated to non-distracting study: a notebook, a deck,
          the cards that are due. No noise on the side. Open it, study, close
          it.
        </p>
        <p>
          That’s the whole idea. Indie on purpose. Small on purpose. Built for
          people who want to learn, not to be kept scrolling.
        </p>
        <p className="lucky__sign">— Lucky Software</p>
        <p className="lucky__contact">
          Feature request or need support? Reach out at{" "}
          <a
            className="text-link text-link--large"
            href="mailto:luckysoftwaretexas@gmail.com"
          >
            luckysoftwaretexas@gmail.com
          </a>
          .
        </p>
        <Link className="button button--ink" to="/">
          Back to Quirkle
        </Link>
      </article>
    </main>
  );
}
